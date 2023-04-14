import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  finalize,
  forkJoin,
  iif,
  Observable,
  of,
  pipe,
  shareReplay,
  Subscription,
  switchMap,
  throwError,
} from 'rxjs';
import { IAnswerResponse } from 'src/app/core/models/answer-response.model';
import { IQuestionResponse } from 'src/app/core/models/question-response.model';
import { IQuizResponse } from 'src/app/core/models/quiz-response.model';
import { CandidateService } from 'src/app/features/user-admin/services/candiate.service';
import { QuizService } from 'src/app/features/user-admin/services/quiz.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-take-quiz',
  templateUrl: './take-quiz.component.html',
  styleUrls: ['./take-quiz.component.css'],
})
export class TakeQuizComponent implements OnInit, OnDestroy {
  quiz: IQuizResponse;
  currentQuestion: IQuestionResponse | undefined;
  currentIdx: number = 0;
  _subscriptions: Subscription[] = [];
  userAnswers: string[] = [];
  questionAnswers?: Observable<IAnswerResponse[]>;
  userQuestions: any;
  userUnansweredQuestionsId: string = '';
  userScore: number = 0;
  questionsLength: number = 0;
  duration: number = 0; //in minutes
  maxQuestionTime: number = 0;
  elapsedTime: string = '00:00';
  timer: any = null;
  timeInterv: number = 1000;
  constructor(
    private router: Router,
    private quizService: QuizService,
    private candiateService: CandidateService,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) {
    this.questionAnswers = this.candiateService.answers$;
    this.quiz = this.router.getCurrentNavigation()?.extras
      .state as IQuizResponse;
    this.route.params.subscribe((params) => {
      console.log(params);
    });
  }
  ngOnInit(): void {
    this._subscriptions.push(this.getQuestions());
  }

  tick() {
    this.duration -= 1;
    this.elapsedTime = this.parseTime();
    if (this.duration === 0) console.log('done');
    // if (this.duration === 0) {
    //   this.validateQuiz();
    // }
  }
  parseTime() {
    let mins: string | number = Math.floor(this.duration / 60);
    let secs: string | number = Math.round(this.duration % 60);
    mins = (mins < 10 ? '0' : '') + mins;
    secs = (secs < 10 ? '0' : '') + secs;
    return this.duration >= 0 ? `${mins}:${secs}` : '00:00';
  }
  findQuestionIndex(): number {
    if (this.currentQuestion)
      return (
        this.userQuestions.findIndex(
          (qst: any) => this.currentQuestion?.questionId === qst.questionId
        ) + 1
      );
    return 1;
  }
  nextQuestion(): void {
    this.currentIdx = this.currentIdx + 1;
    if (this.currentIdx === this.questionsLength) {
      this.router.navigate(['/summary'], {
        relativeTo: this.route,
        state: this.quiz,
      });
      return;
    }
    this._subscriptions.push(this.getQuestions());
  }
  updateUserAnswer(answer: any) {
    if (answer.target.checked) {
      this.userAnswers.push(answer.target.value);
    } else {
      this.userAnswers.splice(this.userAnswers.indexOf(answer.target.value), 1);
    }
  }
  validateQuiz() {
    const answerObs = this.userAnswers.map((answerId) =>
      this.candiateService.submitAnswer({
        answerId: answerId,
        questionUserId: this.currentQuestion?.questionUserId!,
      })
    );
    if (answerObs.length > 0) {
      this._subscriptions.push(
        forkJoin(answerObs).subscribe(() => {
          this.userAnswers = [];
          this.nextQuestion();
        })
      );
    } else
      this._subscriptions.push(
        this.candiateService
          .submitAnswer({
            answerId: '-1',
            questionUserId: this.currentQuestion?.questionUserId!,
          })
          .subscribe(() => {
            this.userAnswers = [];
            this.nextQuestion();
          })
      );
  }
  private getQuestions(): Subscription {
    const userQuestionObs = pipe(
      switchMap((userQuestions: any) => {
        this.userQuestions = userQuestions['value'];
        if (userQuestions['value']?.length)
          this.questionsLength = userQuestions['value'].length;
        return this.quizService.getQuestion(
          this.userUnansweredQuestionsId
            ? this.userUnansweredQuestionsId
            : this.userQuestions[this.currentIdx]
        );
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
    const questionObs = this.quizService
      .getUserQuestions(this.quiz.quizUserId!)
      .pipe(userQuestionObs)
      .subscribe({
        next: (result: any) => {
          this.currentQuestion = this.userQuestions
            .filter(
              (question: IQuestionResponse) =>
                question.questionId === result?.questionId
            )
            .map((question: any) => {
              return {
                ...result,
                maxValidationDate: question.maxValidationDate,
              } as IQuestionResponse;
            })[0];
          this.quiz.questions = [] as IQuestionResponse[];
          if (this.currentQuestion) {
            this.quiz.questions.push(this.currentQuestion);
            this.currentIdx =
              this.quiz.questions.indexOf(this.currentQuestion) + 1;
            this.questionAnswers = this.candiateService.getQuestionAnswers(
              this.currentQuestion
            );
            if (this.currentQuestion.maxValidationDate) {
              const time = new Date(this.currentQuestion.maxValidationDate);
              time.setTime(time.getTime() - 60 * 1000);
              this.duration = Math.floor(
                (time.getTime() - new Date().getTime()) / 1000
              );
            } else {
              this.duration = this.currentQuestion.duration * 60;
            }
            if (this.duration === 0) {
              this.nextQuestion();
            }
            this.timer = setInterval(() => {
              this.tick();
            }, this.timeInterv);
          }
        },
        error: (err) => {
          if (this.currentIdx < this.questionsLength && this.duration === 0) {
            this.nextQuestion();
          }
        },
      });

    return questionObs;
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    this._subscriptions.map((sub) => sub.unsubscribe());
  }
}
