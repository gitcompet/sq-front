import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { forkJoin, map, mergeMap, Observable, tap } from 'rxjs';
import { headers } from 'src/app/core/constants/settings';
import { IQuestion } from 'src/app/core/models/question.model';
import { IQuiz } from 'src/app/core/models/quiz.model';
import { ITest } from 'src/app/core/models/test.model';
import { ITestResponse } from 'src/app/core/models/test-response.model';
import { environment } from 'src/environments/environment.development';
import { IQuizResponse } from 'src/app/core/models/quiz-response.model';
import { IQuestionResponse } from 'src/app/core/models/question-response.model';
import { ITestUserResponse } from 'src/app/core/models/test-user-response.model';
import { ITestQuiz } from 'src/app/core/models/test-quiz-assign.model';
import { IQuizQuestion } from 'src/app/core/models/quiz-question-assign.model copy';

@Injectable({
  providedIn: 'root',
})
export class QuizService {

  constructor(private httpClient: HttpClient) {}
  getAvailableTests(): Observable<ITestResponse[]> {
    return this.httpClient
      .get<ITestResponse[]>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testPaths.base}`
      )
      .pipe(
        map((quizzes: ITestResponse[]) => {
          return quizzes.map((test) => {
            const modifiedTest = {} as ITestResponse;
            modifiedTest.testId = test.testId;
            modifiedTest.testCategoryId = test.testCategoryId;
            modifiedTest.comment = test.comment;
            return modifiedTest;
          });
        })
      );
  }
  getTest(testId: string): Observable<ITestResponse> {
    return this.httpClient
      .get<ITestResponse>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testPaths.base}/${testId}`
      )
      .pipe(
        map((test: ITestResponse) => {
          const modifiedTest = {} as ITestResponse;
          modifiedTest.testId = test.testId;
          modifiedTest.testCategoryId = test.testCategoryId;
          modifiedTest.comment = test.comment;
          return modifiedTest;
        })
      );
  }

  getUserTests(userId: string): Observable<ITestResponse[]> {
    return this.httpClient
      .get<ITestUserResponse[]>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testUserPaths.base}/${userId}`
      )
      .pipe(
        mergeMap((userTests: ITestUserResponse[]) => {
          let testIds = userTests.map(
            (userTest: ITestUserResponse) => userTest.testId
          );
          return forkJoin(testIds.map((id: string) => this.getTest(id))).pipe(
            tap((value) => console.log(value))
          );
        })
      );
  }
  getAvailableQuizzes(): Observable<IQuizResponse[]> {
    return this.httpClient
      .get<IQuizResponse[]>(
        `${environment.baseUrl}${environment.apiVersion}${environment.quizPaths.base}`
      )
      .pipe(
        map((quizzes: IQuizResponse[]) => {
          return quizzes.map((quiz) => {
            const modifiedQuiz = {} as IQuizResponse;
            modifiedQuiz.quizId = quiz.quizId;
            modifiedQuiz.subDomainId = quiz.subDomainId;
            modifiedQuiz.title = quiz.title;
            modifiedQuiz.comment = quiz.comment;
            return modifiedQuiz;
          });
        })
      );
  }
  getAvailableQuestions(): Observable<IQuestionResponse[]> {
    return this.httpClient
      .get<IQuestionResponse[]>(
        `${environment.baseUrl}${environment.apiVersion}${environment.questionPaths.base}`
      )
      .pipe(
        map((quizzes: IQuestionResponse[]) => {
          return quizzes.map((question) => {
            const modifiedQuestion = {} as IQuestionResponse;
            modifiedQuestion.questionId = question.questionId;
            modifiedQuestion.subDomainId = question.subDomainId;
            modifiedQuestion.title = question.title;
            modifiedQuestion.level = question.level;
            modifiedQuestion.comment = question.comment;
            return modifiedQuestion;
          });
        })
      );
  }
  addTest(payload: ITest): Observable<ITest> {
    return this.httpClient
      .post<ITest>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testPaths.base}`,
        payload,
        {
          headers: headers,
        }
      )
      .pipe(
        map((test: ITest) => {
          const modifiedTest = {} as ITest;
          modifiedTest.testId = test.testId;
          modifiedTest.testCategoryId = test.testCategoryId;
          modifiedTest.comment = test.comment;
          return modifiedTest;
        })
      );
  }

  addQuiz(payload: IQuiz): Observable<IQuiz> {
    return this.httpClient
      .post<IQuiz>(
        `${environment.baseUrl}${environment.apiVersion}${environment.quizPaths.base}`,
        payload,
        {
          headers: headers,
        }
      )
      .pipe(
        map((quiz: IQuiz) => {
          const modifiedQuiz = {} as IQuiz;
          modifiedQuiz.quizId = quiz.quizId;
          modifiedQuiz.subDomainId = quiz.subDomainId;
          modifiedQuiz.title = quiz.title;
          modifiedQuiz.comment = quiz.comment;
          return modifiedQuiz;
        })
      );
  }

  addQuestion(payload: IQuestion): Observable<IQuestion> {
    return this.httpClient
      .post<IQuestion>(
        `${environment.baseUrl}${environment.apiVersion}${environment.questionPaths.base}`,
        payload,
        {
          headers: headers,
        }
      )
      .pipe(
        map((question: IQuestion) => {
          const modifiedQuestion = {} as IQuestion;
          modifiedQuestion.questionId = question.questionId;
          modifiedQuestion.subDomainId = question.subDomainId;
          modifiedQuestion.title = question.title;
          return modifiedQuestion;
        })
      );
  }
  assignQuiz(payload: ITestQuiz): Observable<ITestQuiz> {
    return this.httpClient
      .post<ITestQuiz>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testUserPaths.quizTest}`,
        payload,
        {
          headers: headers,
        }
      )
      .pipe(
        map((composedTest: ITestQuiz) => {
          const testQuizAssignation = {} as ITestQuiz;
          testQuizAssignation.testId = composedTest.testId;
          testQuizAssignation.quizId = composedTest.quizId;
          return testQuizAssignation;
        })
      );
  }

  assignQuesion(payload: IQuizQuestion ): Observable<IQuizQuestion> {
    return this.httpClient
      .post<IQuizQuestion>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testUserPaths.quizQuestion}`,
        payload,
        {
          headers: headers,
        }
      )
      .pipe(
        map((composedTest: IQuizQuestion) => {
          const quizQuestionAssignation = {} as IQuizQuestion;
          quizQuestionAssignation.questionId = composedTest.questionId;
          quizQuestionAssignation.quizId = composedTest.quizId;
          return quizQuestionAssignation;
        })
      );
  }
  getQuiz(quizId: string): Observable<IQuiz> {
    return this.httpClient
      .get<IQuiz>(
        `${environment.baseUrl}${environment.apiVersion}${environment.quizPaths.base}/${quizId}`
      )
      .pipe();
  }
  getAsssignedTestQuizzes(): Observable<ITestQuiz[]> {
    return this.httpClient
      .get<ITestQuiz[]>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testUserPaths.quizTest}`
      )
      .pipe();
  }
}
