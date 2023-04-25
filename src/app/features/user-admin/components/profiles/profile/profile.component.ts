import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { IUser } from 'src/app/core/models/user.model';
import { QuizService } from '../../../services/quiz.service';
import {
  IQuizDashboard,
  IQuizResponse,
} from 'src/app/core/models/quiz-response.model';
import { Observable, filter, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { ITestResponse } from 'src/app/core/models/test-response.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [],
})
export class ProfileComponent implements OnInit {
  user: IUser;
  id!: string;
  updateForm: FormGroup;
  headers: string[] = ['Quiz Name', 'Test Name', 'Category', 'Score'];
  tableHeaders: string[] = ['Id','Test Name', 'Category','Action'];
  latestCompletedQuizzes: Observable<IQuizDashboard[]> = new Observable();
  latestPendingQuizzes: Observable<IQuizDashboard[]> = new Observable();
  testsToAssign: Observable<ITestResponse[]>= new Observable();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private quizService: QuizService
  ) {
    this.user = this.router.routerState.snapshot.root.data as IUser;

    this.updateForm = this._formBuilder.group({
      loginId: new FormControl(),
      login: new FormControl('', [Validators.minLength(3)]),
      email: new FormControl('', [Validators.email]),
      firstName: new FormControl('', [Validators.minLength(3)]),
      lastName: new FormControl('', [Validators.minLength(3)]),
    });
    this.updateForm.patchValue(this.user);
    this.updateForm.updateValueAndValidity();
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params) this.id = params['id'];
    });
    const quizzes = this.quizService.getUserTests(this.user.loginId, true).pipe(
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
    this.testsToAssign = quizzes.pipe(map(value=> [...value[0]]),map((tests)=>{
      return tests.map((test)=>{
           return {
            testId: test.testId,
            title: test.title,
            categories: test.categories
           } as ITestResponse
      })
    }));
  }
  save() {}
  assignTestToUser(){}
}
