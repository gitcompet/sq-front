import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, of, Subscription, switchMap } from 'rxjs';
import { IAnswerResponse } from 'src/app/core/models/answer-response.model';
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
  userScore: number = 0;
  quizValidate: boolean = false;
  questionsLength: number = 0;
  constructor(
    private router: Router,
    private quizService: QuizService,
    private candiateService: CandidateService,
    private authService: AuthService,
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
        .pipe()
        .subscribe((questions) => {
          this.currentQuestion = questions[0];
          this.currentIdx = questions.indexOf(this.currentQuestion);
          this.questionAnswers = this.candiateService.getQuestionAnswers(
            this.currentQuestion!.questionId
          );
          this.quiz = { ...this.quiz, questions: questions };
          if (this.quiz.questions?.length)
            this.questionsLength = this.quiz.questions.length;
        })
    );
  }
  findQuestionIndex(): number {
    if (this.quiz.questions && this.currentQuestion)
      return this.quiz.questions.indexOf(this.currentQuestion) + 1;
    return 1;
  }

  previousQuestion(): void {
    this.currentIdx = this.quiz.questions?.indexOf(this.currentQuestion!)! - 1;
    if (this.currentIdx && this.currentIdx <= 0)
      this.currentQuestion = this.quiz.questions?.[0];
    else this.currentQuestion = this.quiz.questions?.at(this.currentIdx);
    this.questionAnswers = this.candiateService.getQuestionAnswers(
      this.currentQuestion!.questionId
    );
  }
  nextQuestion(): void {
    this.currentIdx = this.quiz.questions?.indexOf(this.currentQuestion!)! + 1;
    if (
      this.quiz.questions &&
      this.currentIdx &&
      this.currentIdx >= this.quiz.questions?.length
    )
      this.currentQuestion =
        this.quiz.questions?.[this.quiz.questions?.length - 1];
    else this.currentQuestion = this.quiz.questions?.at(this.currentIdx);
    this.questionAnswers = this.candiateService.getQuestionAnswers(
      this.currentQuestion!.questionId
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
    if (this.currentIdx === this.questionsLength - 1) {
      this.router.navigate(['/score'], {
        relativeTo: this.route,
        state: { quizUserId: this.quiz.quizUserId },
      });
    } else {
      this.nextQuestion();
      // this.candiateService.submitAnswer({answerId:})
      const answerObs: Observable<IAnswerResponse>[] = this.userAnswers.map(
        (answerId) =>
          this.candiateService.submitAnswer({
            answerId: answerId,
            questionUserId: this.currentQuestion!.questionUserId,
          })
      );
      this._subscriptions.push(forkJoin(answerObs).subscribe());
    }
  }
  calculateScore() {
    return this.userScore;
  }
  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }
}
