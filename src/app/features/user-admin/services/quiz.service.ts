import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { forkJoin, map, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
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
import { ElementTypes, IDomain } from 'src/app/core/models/domain.model';
import { Patch } from 'src/app/core/models/patch.model';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  constructor(private httpClient: HttpClient) {}

  // TESTS SECTION
  getAvailableTests(): Observable<any[]> {
    return this.httpClient
      .get<any[]>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testPaths.base}`
      )
      .pipe(
        map((tests: ITestResponse[]) => {
          return tests.map((test) => {
            const modifiedTest = {} as ITestResponse;
            modifiedTest.testId = test.testId;
            modifiedTest.testCategoryId = test.testCategoryId;
            modifiedTest.categoryNames = test.categoryNames;
            modifiedTest.comment = test.comment;
            modifiedTest.title = test.title;
            modifiedTest.label = test.label;
            return modifiedTest;
          });
        }),
        switchMap((newTests: ITestResponse[]) => {
          const testsObervables: Observable<ITestResponse>[] = newTests.map(
            (newTest: ITestResponse) => this.getTestCategories(newTest.testId)
          );
          const observables = [of(newTests), forkJoin(testsObervables)];
          return forkJoin(observables);
        }),

        map((compositions) => {
          const tests: ITestResponse[] = compositions[0] as ITestResponse[];
          const categories = compositions[1] as ITestResponse[];

          return tests.map((test) => {
            const testCatgories: any = categories.filter(
              (category: any) => category.testId === test.testId
            )[0];
            return {
              ...test,
              categoryNames: [...testCatgories.categoryNames],
              testCategoryId: [...testCatgories.testCategoryId],
            };
          });
        })
      );
  }
  private getTestCategories(testId: string): Observable<ITestResponse> {
    return this.httpClient.get<ITestResponse>(
      `${environment.baseUrl}${environment.apiVersion}${environment.testPaths.testCategories}/${testId}`
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
        switchMap((userTests: ITestUserResponse[]) => {
          const testIds = userTests.map(
            (userTest: ITestUserResponse) => userTest.testId
          );

          return forkJoin(testIds.map((id: string) => this.getTest(id)));
        }),
        switchMap((newTests: ITestResponse[]) => {
          const testsObervables: Observable<ITestResponse>[] = newTests.map(
            (newTest: ITestResponse) => this.getTestCategories(newTest.testId)
          );
          const observables = [of(newTests), forkJoin(testsObervables)];
          return forkJoin(observables);
        }),
        switchMap((tests) => {
          tests[0] = tests[0].map((test) => {
            const testCatgories: any = tests[1].filter(
              (category: any) => category.testId === test.testId
            )[0];
            return {
              ...test,
              categoryNames: [...testCatgories.categoryNames],
              testCategoryId: [...testCatgories.testCategoryId],
            };
          });

          const observables = [of(tests[0]), this.getAsssignedTestQuizzes()];
          return forkJoin(observables);
        }),
        switchMap((result) => {
          const testQuizzes: ITestQuiz[] = result[1] as ITestQuiz[];
          const quizIds = testQuizzes
            .map((testQuiz) => testQuiz.quizId)
            .filter((item, pos, self) => self.indexOf(item) == pos);
          const observables = [
            of(result),
            forkJoin(quizIds.map((quizId) => this.getQuiz(quizId))),
          ];
          return forkJoin(observables);
        }),
        map((result) => {
          const tests: ITestResponse[] =
            result[0][0] as unknown as ITestResponse[];
          const testQuiz: ITestQuiz[] = result[0][1] as unknown as ITestQuiz[];
          const quizzes: IQuizResponse[] =
            result[1] as unknown as IQuizResponse[];
          const testsWithQuizzes = tests.map((test) => {
            const filtredComposition = testQuiz
              .filter((testQuiz) => test.testId === testQuiz.testId)
              .map((testQuiz) => testQuiz.quizId);
            return {
              ...test,
              quizzes: quizzes.filter((quiz: IQuizResponse) =>
                filtredComposition.includes(quiz.quizId)
              ),
            };
          });
          return testsWithQuizzes;
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

  updateTest(payload: Patch[]): Observable<ITestResponse> {
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
  getAsssignedQuizzes(testId: string): Observable<IQuizResponse[]> {
    return this.httpClient
      .get<IQuizResponse[]>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testUserPaths.quizTest}/${testId}`
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
        }),

        switchMap((newQuizzes: IQuizResponse[]) => {
          const quizzesDomainsObervables: Observable<any>[] = newQuizzes.map(
            (newQuiz: IQuizResponse) =>
              this.getElementDomain({ id: newQuiz.quizId }, ElementTypes.QUIZ)
          );
          const observables = [
            of(newQuizzes),
            forkJoin(quizzesDomainsObervables),
          ];

          return forkJoin(observables);
        }),
        map((compositions) => {
          const quizzes: IQuizResponse[] = compositions[0] as IQuizResponse[];
          const domains = compositions[1] as any[];

          return quizzes.map((quiz) => {
            const quizDomains: any = domains.filter(
              (domain: any) => domain.elementId === quiz.quizId
            )[0];
            return {
              ...quiz,
              domainNames: [...quizDomains.domainNames],
              // subDomainNames:[...quizDomains.subDomainNames]
            };
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
        }),

        switchMap((newQuestions: IQuestionResponse[]) => {
          const quizzesDomainsObervables: Observable<any>[] = newQuestions.map(
            (newQuestion: IQuestionResponse) =>
              this.getElementDomain(
                { id: newQuestion.questionId },
                ElementTypes.QUESTION
              )
          );
          const observables = [
            of(newQuestions),
            forkJoin(quizzesDomainsObervables),
          ];

          return forkJoin(observables);
        }),
        map((compositions) => {
          const questions: IQuestionResponse[] =
            compositions[0] as IQuestionResponse[];
          const domains = compositions[1] as any[];

          return questions.map((question) => {
            const questionDomains: any = domains.filter(
              (domain: any) => domain.elementId === question.questionId
            )[0];
            return {
              ...question,
              domainNames: [...questionDomains.domainNames],
              // subDomainNames:[...quizDomains.subDomainNames]
            };
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

  getElementDomain(element: any, type: string): Observable<any[]> {
    return this.httpClient
      .get<any[]>(
        `${environment.baseUrl}${environment.apiVersion}${environment.categoryPaths.domainCompose}/${element.id}`,
        { params: new HttpParams().set('type', type) }
      )
      .pipe();
  }
}
