import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  first,
  forkJoin,
  interval,
  Observable,
  of,
  pipe,
  Subscription,
  switchMap,
  take,
  TimeInterval,
  timeInterval,
  timer,
} from 'rxjs';
import { IAnswerResponse } from 'src/app/core/models/answer-response.model';
import { IAnswer } from 'src/app/core/models/answer.model';
import { IQuestionResponse } from 'src/app/core/models/question-response.model';
import { IQuizQuestion } from 'src/app/core/models/quiz-question-assign.model copy';
import { IQuizResponse } from 'src/app/core/models/quiz-response.model';
import { CandidateService } from 'src/app/features/user-admin/services/candiate.service';
import { QuizService } from 'src/app/features/user-admin/services/quiz.service';
import { AuthService } from 'src/app/shared/services/auth.service';

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
  userScore: number = 0;
  questionsLength: number = 0;
  duration: number = 0; //in minutes
  elapsedTime: string = '00:00';
  timer: any = null;
  timeInterv: number = 1000;
  constructor(
    private router: Router,
    private quizService: QuizService,
    private candiateService: CandidateService,
    private route: ActivatedRoute
  ) {
    this.questionAnswers = this.candiateService.answers$;
    this.quiz = this.router.getCurrentNavigation()?.extras
      .state as IQuizResponse;
  }
  ngOnInit(): void {
    this._subscriptions.push(
      this.quizService
        .getUserQuestions(this.quiz.quizUserId!)
        .pipe(
          switchMap((userQuestions) => {
            this.userQuestions = userQuestions['value'];
            if (userQuestions['value']?.length)
              this.questionsLength = userQuestions['value'].length;
            return this.quizService.getQuestion(this.userQuestions[0]);
          })
        )
        .subscribe((question) => {
          this.currentQuestion = question;
          this.quiz.questions =[] as IQuestionResponse[];
          this.quiz.questions.push(question);
          if (this.currentQuestion) {
            this.duration = this.currentQuestion.duration * 60;
            this.timer = setInterval(() => {
              this.tick();
            }, this.timeInterv);
          }

          this.currentIdx = 0;
          this.questionAnswers = this.candiateService.getQuestionAnswers(
            this.currentQuestion!
          );
        })
    );
  }
  tick() {
    this.duration = this.duration - this.timeInterv / 1000;
    this.elapsedTime = this.parseTime();
    if (this.duration === 0) {
      this.validateQuiz();
    }
  }
  parseTime() {
    let mins: string | number = Math.floor(this.duration / 60);
    let secs: string | number = Math.round(this.duration % 60);
    mins = (mins < 10 ? '0' : '') + mins;
    secs = (secs < 10 ? '0' : '') + secs;
    return this.duration >= 0 ? `${mins}:${secs}` : '00:00';
  }
  findQuestionIndex(): number {
    if (this.currentQuestion) return this.currentIdx + 1;
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
    this._subscriptions.push(
      this.quizService
        .getQuestion(this.userQuestions[this.currentIdx])

        .subscribe((question) => {
          this.quiz.questions = [...this.quiz.questions,question];
          this.currentQuestion = question;
          if (this.currentQuestion) {
            this.duration = this.currentQuestion.duration * 60;
            this.questionAnswers = this.candiateService.getQuestionAnswers(
              this.currentQuestion!
            );
          }
        })
    );
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
  ngOnDestroy(): void {
    clearInterval(this.timer);
    this._subscriptions.map((sub) => sub.unsubscribe());
  }
}
