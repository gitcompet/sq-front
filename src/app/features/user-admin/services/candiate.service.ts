import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  BehaviorSubject,
  Observable,
  forkJoin,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { IQuizScore } from 'src/app/core/models/quiz-score.model';
import { IAnswerResponse } from 'src/app/core/models/answer-response.model';
import { IAnswer } from 'src/app/core/models/answer.model';
import { OperationType, Patch } from 'src/app/core/models/patch.model';
import { IQuizResponse } from 'src/app/core/models/quiz-response.model';
import { IQuestionResponse } from 'src/app/core/models/question-response.model';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  answers$: BehaviorSubject<IAnswerResponse[]>;
  constructor(private httpClient: HttpClient) {
    this.answers$ = new BehaviorSubject<IAnswerResponse[]>([]);
  }
  getQuestionAnswers(question: IQuestionResponse): Observable<IAnswerResponse[]> {
    return this.httpClient
      .get<IAnswerResponse[]>(
        `${environment.baseUrl}${environment.apiVersion}${environment.questionPaths.questionAnswers}/${question.questionId}?quizUserId=${question.quizUserId}`
      )
      .pipe(
        switchMap((questionAnswers) => {
          return forkJoin(
            questionAnswers.map((questionAnswer) =>
              {return this.getAnswer({...questionAnswer,quizUserId: question.quizUserId})}
            )
          );
        })
      );
  }

  submitAnswer(answer: IAnswer): Observable<IAnswerResponse> {
    return this.httpClient.post<IAnswerResponse>(
      `${environment.baseUrl}${environment.apiVersion}${environment.questionPaths.answerUser}`,
      answer
    );
  }
  getAnswer(answer: IAnswerResponse): Observable<IAnswerResponse> {
    return this.httpClient.get<IAnswerResponse>(
      `${environment.baseUrl}${environment.apiVersion}${environment.questionPaths.answer}/${answer.answerId}?quizUserId=${answer.quizUserId}`
    );
  }
  updateUserQuiz(patch: Patch[],quizUserId: string) {
    return this.httpClient
      .patch<IQuizResponse>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testUserPaths.userQuiz}/${quizUserId}`,
        patch
      )
      .pipe();
  }
  getQuizScore(quizUserId: string): Observable<any> {
    return this.httpClient
      .get<any>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testUserPaths.userQuiz}/${quizUserId}?isParentURL=false`
      )
      .pipe(
          map((userQuiz) => {
         if (userQuiz) {
            return {
              quizScore: userQuiz.score,
              quizId: userQuiz.quizId
            } as IQuizScore;
          }
          return {} as IQuizScore;
        })
      );
  }
  getUserScore(quizUserId: string): Observable<any> {
    return this.httpClient
      .get<any>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testUserPaths.userQuiz}/${quizUserId}?isParentURL=false`
      )
      .pipe(
          map((userQuiz) => {
         if (userQuiz[1]['value']) {
            const quizScores = userQuiz[1]['value'];
            const finalScore = quizScores
              .map((quizScore: any) => quizScore.score)
              .reduce((acc: number, value: number) => (acc += value));
            return {
              quizScore: (finalScore * 100) / quizScores.length,
            } as IQuizScore;
          }
          return {} as IQuizScore;
        })
      );
  }
  getUnansweredQuizQuestions(quizId: string): Observable<string[]> {
    return this.httpClient
      .get<string[]>(
        `${environment.baseUrl}${environment.apiVersion}${environment.questionPaths.answerUser}${environment.questionPaths.unansweredUserQuestion}/${quizId}`
      )
      .pipe();
  }
}
