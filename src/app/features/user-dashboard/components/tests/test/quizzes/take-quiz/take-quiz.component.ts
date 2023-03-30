import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of, Subscription, switchMap } from 'rxjs';
import { IQuestionResponse } from 'src/app/core/models/question-response.model';
import { IQuestion } from 'src/app/core/models/question.model';
import { IQuizQuestion } from 'src/app/core/models/quiz-question-assign.model copy';
import { IQuizResponse } from 'src/app/core/models/quiz-response.model';
import { QuizService } from 'src/app/features/user-admin/services/quiz.service';

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
  constructor(private router: Router, private quizService: QuizService) {
    this.quiz = this.router.getCurrentNavigation()?.extras
      .state as IQuizResponse;
  }
  ngOnInit(): void {
    this._subscriptions.push(
      this.quizService
        .getAsssignedQuizQuestions()
        .pipe(
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
          const quizQuestions = questions.filter((question, pos) =>
            compositions.find(
              (composition) =>
                composition.questionId === question.questionId &&
                composition.quizId === this.quiz.quizId
            )
          );
          this.currentQuestion = quizQuestions[0];
          this.quiz = { ...this.quiz, questions: quizQuestions };
        })
    );
  }
  findQuestionIndex(): number {
    if (this.quiz.questions && this.currentQuestion)
      return this.quiz.questions.indexOf(this.currentQuestion) + 1;
    return 1;
  }
  getQuestionAnswers(currentQuestion: IQuestionResponse) {
    const idx = this.quiz.questions?.indexOf(currentQuestion);
    if (idx === 0)
      currentQuestion.answers = [
        'addEventListener',
        'attachEvent',
        'attachEventListener',
        'listen',
      ];
    if (idx === 1)
      currentQuestion.answers = ['blur', 'focus', 'load', 'select'];
    if (idx === 2)
      currentQuestion.answers = [
        'auto',
        'normal',
        'row nowrap',
        'row wrap',
        'row no-wrap',
      ];
      return  currentQuestion.answers;
  }
  previousQuestion(): void {
    this.currentIdx = this.quiz.questions?.indexOf(this.currentQuestion!)! - 1;
    if (this.currentIdx && this.currentIdx <= 0)
      this.currentQuestion = this.quiz.questions?.[0];
    else this.currentQuestion = this.quiz.questions?.at(this.currentIdx);
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
  }
  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }
}
