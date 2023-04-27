import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from 'src/app/core/models/user.model';
import { QuizService } from '../../../services/quiz.service';
import { IQuizDashboard } from 'src/app/core/models/quiz-response.model';
import {
  Observable,
  Subscription,
  count,
  defaultIfEmpty,
  filter,
  forkJoin,
  iif,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { ITestResponse } from 'src/app/core/models/test-response.model';
import { OperationType, Patch } from 'src/app/core/models/patch.model';
import { UserService } from 'src/app/features/user-profile/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [],
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: IUser;
  id!: string;
  updateForm: FormGroup;
  headers: string[] = ['Quiz Name', 'Test Name', 'Category', 'Score'];
  tableHeaders: string[] = ['Id', 'Test Name', 'Category', 'Action'];
  latestCompletedQuizzes: Observable<IQuizDashboard[]> = new Observable();
  latestPendingQuizzes: Observable<IQuizDashboard[]> = new Observable();
  testsToAssign: Observable<ITestResponse[]> = new Observable();
  private _subscriptions: Subscription[] = [];
  assignedTests: ITestResponse[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private quizService: QuizService,
    private userService: UserService
  ) {
    this.user = this.router.getCurrentNavigation()?.extras.state as IUser;

    this.updateForm = this._formBuilder.group({
      loginId: new FormControl(),
      login: new FormControl('', [Validators.minLength(3)]),
      email: new FormControl('', [Validators.email]),
      firstName: new FormControl('', [Validators.minLength(3)]),
      lastName: new FormControl('', [Validators.minLength(3)]),
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params) {
        this.id = params['id'];
        this.init();
      }
    });
  }

  save() {
    if (!this.updateForm.valid) return;
    const controls = this.updateForm.controls;
    const patches: Patch[] = Object.entries(controls).map((entry) => ({
      path: `/${entry[0]}`,
      op: OperationType.REPLACE,
      value: entry[1].value,
    }));
    this._subscriptions.push(
      this.userService
        .patchUser(controls['loginId'].value, patches)
        .subscribe((res) => {
          this.updateForm.patchValue(res);
          this.updateForm.updateValueAndValidity();
        })
    );
  }
  isAlreadyAssgined(item: any): boolean {
    return (
      this.assignedTests.find((test) => test.testId === item) === undefined
    );
  }
  assignTestToUser(testId: string) {
    this._subscriptions.push(
      this.quizService
        .assignTestToUser({
          loginId: this.id,
          testId: testId,
        })
        .pipe(
          tap((res) => {
            return (this.testsToAssign = this.testsToAssign.pipe(
              tap((tests) => {
                const assignedTest = tests.find(
                  (ts) => ts.testId === res.testId
                );
                if (assignedTest)
                  this.assignedTests = [...this.assignedTests, assignedTest];
              })
            ));
          })
        )
        .subscribe()
    );
  }
  unAssignTestFromUser(testId: any) {
    this._subscriptions.push(
      this.quizService
        .getUserTests(this.id, true)
        .pipe(
          switchMap((res: ITestResponse[]) => {
            const testUserId = res.find(
              (test) => test.testId === testId
            )?.testUserId;

            if (testUserId)
              return this.quizService.unAssignTestFromUser(testUserId);
            return of();
          }),
          tap((res) => {
            return (this.testsToAssign = this.testsToAssign.pipe(
              tap((tests) => {
                const unassignedTest = tests.find(
                  (ts) => ts.testId === res.testId
                );
                if (unassignedTest)
                  this.assignedTests = this.assignedTests.filter(
                    (test) => unassignedTest.testId !== test.testId
                  );
              })
            ));
          })
        )
        .subscribe((res) => {})
    );
  }
  private init() {
    const quizzes = this.quizService.getUserTests(this.id, true).pipe(
      switchMap((tests) => {
        return forkJoin([
          of(tests),
          forkJoin(
            tests.map((test) =>
              this.quizService.getUserQuizzes(test.testUserId)
            )
          ),
        ]);
      })
    );
    this._subscriptions.push(
      this.userService.getProfile(this.id).subscribe((user) => {
        this.updateForm.patchValue(user);
        this.updateForm.updateValueAndValidity();
      })
    );
    this.latestCompletedQuizzes = quizzes.pipe(
      map((res) => {
        const tests = res[0];
        const quizzes = res[1].flat(1);
        const filtred = quizzes.filter((quiz) => quiz.isClosed);
        return filtred.map((quiz, index) => {
          return {
            title: quiz.title,
            testName: tests[index]?.title,
            domains: quiz.domains,
            score: quiz.score,
          } as IQuizDashboard;
        });
      })
    );
    this.latestPendingQuizzes = quizzes.pipe(
      map((res) => {
        const tests = res[0];
        const quizzes = res[1].flat(1);
        const filtred = quizzes.filter((quiz) => !quiz.isClosed);
        return filtred.map((quiz, index) => {
          return {
            title: quiz.title,
            testName: tests[index]?.title,
            domains: quiz.domains,
            score: quiz.score,
          } as IQuizDashboard;
        });
      })
    );
    this.getTestToAssign(quizzes);
  }
  private getTestToAssign(quizzes: Observable<[ITestResponse[], any[]]>) {
    this.testsToAssign = this.quizService.getAvailableTests().pipe(
      switchMap((tests) => {
        return forkJoin([of(tests), quizzes.pipe(defaultIfEmpty([]))]);
      }),
      map((res) => {
        const tests = res[0];
        const userTests = res[1][0];
        this.assignedTests = tests
          .filter((test) => {
            return userTests === undefined
              ? test
              : userTests.some((ts) => ts.testId === test.testId);
          })
          .map((test) => {
            return {
              testId: test.testId,
              title: test.title,
              categories: test.categories,
            } as ITestResponse;
          });
        return tests.map((test) => {
          return {
            testId: test.testId,
            title: test.title,
            categories: test.categories,
          } as ITestResponse;
        });
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }
}
