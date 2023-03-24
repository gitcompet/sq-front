import { Component, OnInit } from '@angular/core';
import { forkJoin, of, Subscription, switchMap } from 'rxjs';
import { IQuizResponse } from 'src/app/core/models/quiz-response.model';
import { IQuiz } from 'src/app/core/models/quiz.model';
import { ITestQuiz } from 'src/app/core/models/test-quiz-assign.model';
import { ITestResponse } from 'src/app/core/models/test-response.model';
import { QuizService } from 'src/app/features/user-admin/services/quiz.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css'],
})
export class TestsComponent implements OnInit {
  tests: ITestResponse[] = [];
  _subscriptions: Subscription[] = [];
  constructor(
    private modalService: ModalService,
    private quizService: QuizService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this._subscriptions.push(this.modalService.getDataExchange().subscribe());

    if (!this.authService.isAdmin()) {
      this._subscriptions.push(
        this.quizService
          .getUserTests('11')
          .subscribe((res: ITestResponse[]) => {
            this.tests = res;
          })
      );
    } else {
      this._subscriptions.push(
        this.quizService
          .getAvailableTests()
          .pipe(
            switchMap((res: ITestResponse[]) => {
              this.tests = res;
              return this.quizService.getAsssignedTestQuizzes();
            }),
            switchMap((compositions: ITestQuiz[]) => {
              const filtredComposition = compositions
                .map((testQuiz) => testQuiz.quizId)
                .filter((item, pos, self) => self.indexOf(item) == pos);


              const observables = [
                of(compositions),
                forkJoin(
                  filtredComposition.map((quizId) =>
                    this.quizService.getQuiz(quizId)
                  )
                ),
              ];
              return forkJoin(observables);
            })
          )
          .subscribe((mergedResults) => {
            const compositions: ITestQuiz[] = mergedResults[0] as ITestQuiz[];
            const quizzes: IQuizResponse[] =
              mergedResults[1] as IQuizResponse[];
            this.tests = this.tests.map((test) => {
              const filtredComposition = compositions
                .filter((testQuiz) => test.testId === testQuiz.testId)
                .map((testQuiz) => testQuiz.quizId);
              return {
                ...test,
                quizzes: quizzes.filter((quiz: IQuizResponse) =>
                  filtredComposition.includes(quiz.quizId)
                ),
              };
            });
          })
      );
    }
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
