import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of, Subscription, switchMap } from 'rxjs';
import { IQuestionResponse } from 'src/app/core/models/question-response.model';
import { IQuizQuestion } from 'src/app/core/models/quiz-question-assign.model copy';
import { IQuizResponse } from 'src/app/core/models/quiz-response.model';
import { QuizService } from 'src/app/features/user-admin/services/quiz.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.css'],
})
export class QuizzesComponent implements OnInit {
  quizzes: IQuizResponse[] = [];
  @Input() relatedTestQuizzes!: IQuizResponse[] | undefined;
  isAdmin: boolean = false;
  _subscriptions: Subscription[] = [];
  constructor(
    private modalService: ModalService,
    private quizService: QuizService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this._subscriptions.push(this.modalService.getDataExchange().subscribe());
    if (this.router.url.includes('/admin/tests') && this.relatedTestQuizzes) {
      this.quizzes = this.relatedTestQuizzes;
    } else {
      this._subscriptions.push(
        this.quizService
          .getAvailableQuizzes()
          .pipe(
            switchMap((res: IQuizResponse[]) => {
              this.quizzes = res;
              return this.quizService.getAsssignedQuizQuestions();
            }),
            switchMap((compositions: IQuizQuestion[]) => {
              const filtredComposition = compositions
                .map((quizQuestion) => quizQuestion.questionId)
                .filter((item, pos, self) => self.indexOf(item) === pos);

              const observables = [
                of(compositions),
                forkJoin(
                  filtredComposition.map((questionId) =>
                    this.quizService.getQuestion(questionId)
                  )
                ),
              ];
              return forkJoin(observables);
            })
          )
          .subscribe((mergedResults) => {
            const compositions: IQuizQuestion[] =
              mergedResults[0] as IQuizQuestion[];
            const questions: IQuestionResponse[] =
              mergedResults[1] as IQuestionResponse[];
            this.quizzes = this.quizzes.map((quiz) => {
              return {
                ...quiz,
                questions: questions.filter((question, pos) =>
                  compositions.find(
                    (composition) =>
                      composition.questionId === question.questionId &&
                      composition.quizId === quiz.quizId
                  )
                ),
              };
            });
          })
      );
    }
  }
  quizDetails(quizId: any) {
    if (this.isAdmin) {
      const quizUrl = this.router.createUrlTree(['..', 'quizzes', quizId], {
        fragment: quizId,
        relativeTo: this.route,
      });
      this.router.navigateByUrl(quizUrl);
    }
  }
  ngOnDestroy(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
