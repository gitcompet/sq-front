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
import { IDomain } from 'src/app/core/models/domain.model';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  constructor(private httpClient: HttpClient) {}


  // TESTS SECTION
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
            modifiedTest.title = test.title;
            modifiedTest.label = test.label;
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
          modifiedTest.title = test.title;
          modifiedTest.label = test.label;
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
          return forkJoin(testIds.map((id: string) => this.getTest(id)));
        })
      );
  }

  addTest(payload: ITest): Observable<ITestResponse> {
    return this.httpClient
      .post<ITestResponse>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testPaths.base}`,
        payload,
        {
          headers: headers,
        }
      )
      .pipe(
        map((test: ITestResponse) => {
          const modifiedTest = {} as ITestResponse;
          modifiedTest.testId = test.testId;
          modifiedTest.testCategoryId = test.testCategoryId;
          modifiedTest.comment = test.comment;
          modifiedTest.title = test.title;
          modifiedTest.label = test.label;
          return modifiedTest;
        })
      );
  }

  updateTest(payload: ITest): Observable<ITestResponse> {
    return this.httpClient
      .patch<ITestResponse>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testPaths.base}`,
        payload,
        {
          headers: headers,
        }
      )
      .pipe(
        map((test: ITestResponse) => {
          const modifiedTest = {} as ITestResponse;
          modifiedTest.testId = test.testId;
          modifiedTest.testCategoryId = test.testCategoryId;
          modifiedTest.comment = test.comment;
          modifiedTest.title = test.title;
          modifiedTest.label = test.label;
          return modifiedTest;
        })
      );
  }
  deleteTest(testId: string): Observable<ITestResponse> {
    return this.httpClient.delete<ITestResponse>(
      `${environment.baseUrl}${environment.apiVersion}${environment.testPaths.base}/${testId}`
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
  getAsssignedTestQuizzes(): Observable<ITestQuiz[]> {
    return this.httpClient
      .get<ITestQuiz[]>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testUserPaths.quizTest}`
      )
      .pipe();
  }
  // QUIZZES SECTION
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
            modifiedQuiz.label = quiz.label;
            modifiedQuiz.comment = quiz.comment;
            return modifiedQuiz;
          });
        })
      );
  }
  addQuiz(payload: IQuiz): Observable<IQuizResponse> {
    return this.httpClient
      .post<IQuizResponse>(
        `${environment.baseUrl}${environment.apiVersion}${environment.quizPaths.base}`,
        payload,
        {
          headers: headers,
        }
      )
      .pipe(
        map((quiz: IQuizResponse) => {
          const modifiedQuiz = {} as IQuizResponse;
          modifiedQuiz.quizId = quiz.quizId;
          modifiedQuiz.subDomainId = quiz.subDomainId;
          modifiedQuiz.title = quiz.title;
          modifiedQuiz.comment = quiz.comment;
          return modifiedQuiz;
        })
      );
  }
  updateQuiz(payload: IQuiz): Observable<IQuizResponse> {
    return this.httpClient
      .patch<IQuizResponse>(
        `${environment.baseUrl}${environment.apiVersion}${environment.quizPaths.base}`,
        payload,
        {
          headers: headers,
        }
      )
      .pipe(
        map((quiz: IQuizResponse) => {
          const modifiedQuiz = {} as IQuizResponse;
          modifiedQuiz.quizId = quiz.quizId;
          modifiedQuiz.subDomainId = quiz.subDomainId;
          modifiedQuiz.title = quiz.title;
          modifiedQuiz.comment = quiz.comment;
          return modifiedQuiz;
        })
      );
  }

  deleteQuiz(quizId: string): Observable<IQuizResponse> {
    return this.httpClient.delete<IQuizResponse>(
      `${environment.baseUrl}${environment.apiVersion}${environment.quizPaths.base}/${quizId}`
    );
  }
  assignQuesion(payload: IQuizQuestion): Observable<IQuizQuestion> {
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
  getQuiz(quizId: string): Observable<IQuizResponse> {
    return this.httpClient
      .get<IQuizResponse>(
        `${environment.baseUrl}${environment.apiVersion}${environment.quizPaths.base}/${quizId}`
      )
      .pipe();
  }
  getAsssignedQuizQuestions(): Observable<IQuizQuestion[]> {
    return this.httpClient
      .get<IQuizQuestion[]>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testUserPaths.quizQuestion}`
      )
      .pipe();
  }
  // QUESTIONS SECTION
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
            modifiedQuestion.label = question.label;
            modifiedQuestion.level = question.level;
            modifiedQuestion.comment = question.comment;
            return modifiedQuestion;
          });
        })
      );
  }
  addQuestion(payload: IQuestion): Observable<IQuestionResponse> {
    return this.httpClient
      .post<IQuestionResponse>(
        `${environment.baseUrl}${environment.apiVersion}${environment.questionPaths.base}`,
        payload,
        {
          headers: headers,
        }
      )
      .pipe(
        map((question: IQuestionResponse) => {
          const modifiedQuestion = {} as IQuestionResponse;
          modifiedQuestion.questionId = question.questionId;
          modifiedQuestion.subDomainId = question.subDomainId;
          modifiedQuestion.title = question.title;
          return modifiedQuestion;
        })
      );
  }
  updateQuestion(payload: IQuestion): Observable<IQuestionResponse> {
    return this.httpClient
      .patch<IQuestionResponse>(
        `${environment.baseUrl}${environment.apiVersion}${environment.questionPaths.base}`,
        payload,
        {
          headers: headers,
        }
      )
      .pipe(
        map((question: IQuestionResponse) => {
          const modifiedQuestion = {} as IQuestionResponse;
          modifiedQuestion.questionId = question.questionId;
          modifiedQuestion.subDomainId = question.subDomainId;
          modifiedQuestion.title = question.title;
          return modifiedQuestion;
        })
      );
  }
  deleteQuestion(questionId: string): Observable<IQuestionResponse> {
    return this.httpClient.delete<IQuestionResponse>(
      `${environment.baseUrl}${environment.apiVersion}${environment.questionPaths.base}/${questionId}`
    );
  }

  getQuestion(questionId: string): Observable<IQuestionResponse> {
    return this.httpClient
      .get<IQuestionResponse>(
        `${environment.baseUrl}${environment.apiVersion}${environment.questionPaths.base}/${questionId}`
      )
      .pipe();
  }

  //OTHERS
  getCategories(): Observable<IDomain[]> {
    return this.httpClient
      .get<IDomain[]>(
        `${environment.baseUrl}${environment.apiVersion}${environment.categoryPaths.base}`
      )
      .pipe(tap((res) => console.log(res)));
  }
}
