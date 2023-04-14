import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { forkJoin, map, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import { headers, patchHeaders } from 'src/app/core/constants/settings';
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
  getAvailableTests(): Observable<ITestResponse[]> {
    return this.httpClient
      .get<ITestResponse[]>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testPaths.base}`
      )
      .pipe(
        map((tests: ITestResponse[]) => {
          return tests.map((test) => {
            const modifiedTest = {} as ITestResponse;
            modifiedTest.testId = test.testId;
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
              categories: testCatgories.categoryNames.map(
                (categoryName: string, index: number) => {
                  return {
                    domainId: testCatgories.testCategoryId[index],
                    name: categoryName,
                  } as IDomain;
                }
              ),
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
        `${environment.baseUrl}${environment.apiVersion}${environment.testUserPaths.base}/${userId}?isParentURL=true`
      )
      .pipe(
        switchMap((userTests: ITestUserResponse[]) => {
          const testIds = userTests.map(
            (userTest: ITestUserResponse) => userTest.testId
          );
          const userTestIds = userTests.map(
            (userTest: ITestUserResponse) => userTest.testUserId
          );
          const observables = [
            forkJoin(testIds.map((id: string) => this.getTest(id))),
            of(userTestIds),
          ];
          return forkJoin(observables);
        }),

        switchMap((newTests) => {
          const tests = newTests[0] as ITestResponse[];
          const userTestIds = newTests[1] as string[];

          const testsObervables: Observable<ITestResponse>[] = tests.map(
            (newTest: ITestResponse) => this.getTestCategories(newTest.testId)
          );
          const observables = [
            of(tests),
            forkJoin(testsObervables),
            of(userTestIds),
          ];
          return forkJoin(observables);
        }),
        switchMap((tests) => {
          const ts = tests[0] as ITestResponse[];
          const categories = tests[1] as ITestResponse[];
          const userTestIds = tests[2] as string[];

          return of(
            ts.map((test, index) => {
              const testCatgories: any = categories.filter(
                (category: any) => category.testId === test.testId
              )[0];
              return {
                ...test,
                testUserId: userTestIds[index],
                categories: testCatgories.categoryNames.map(
                  (categoryName: string, index: number) => {
                    return {
                      domainId: testCatgories.testCategoryId[index],
                      name: categoryName,
                    } as IDomain;
                  }
                ),
              };
            })
          );
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
          modifiedTest.comment = test.comment;
          modifiedTest.title = test.title;
          modifiedTest.label = test.label;
          return modifiedTest;
        })
      );
  }

  updateTest(testId:string,payload: Patch[]): Observable<ITestResponse> {
    return this.httpClient
      .patch<ITestResponse>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testPaths.base}/${testId}`,
        payload,
        {
          headers: patchHeaders,
        }
      )
      .pipe(
        map((test: ITestResponse) => {
          const modifiedTest = {} as ITestResponse;
          modifiedTest.testId = test.testId;
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
  getAsssignedTestQuizzes(testId: string): Observable<ITestQuiz[]> {
    return this.httpClient
      .get<ITestQuiz[]>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testUserPaths.quizTest}/${testId}?isParentURL=true`
      )
      .pipe();
  }
  getUserQuizzes(testUserId: string): Observable<any> {
    return this.httpClient
      .get<any>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testUserPaths.userQuiz}/${testUserId}?isParentURL=true`
      )
      .pipe(
        switchMap((userQuiz) => {
          return forkJoin(
            userQuiz['value'].map((quiz: any) => this.getQuiz(quiz))
          );
        })
      );
  }
  updateUserQuiz(id: string, payload: Patch[]): Observable<IQuizResponse> {
    return this.httpClient
      .patch<IQuizResponse>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testUserPaths.userQuiz}/${id}`,
        payload,
        {
          headers: patchHeaders,
        }
      )
      .pipe(
        switchMap((res) => {
          return this.getQuiz({
            quizId: res.quizId,
            quizUserId: res.quizUserId,
            testUserId: res.testUserId,
          } as IQuizResponse);
        }),
        map((quiz) => {
          const modifiedQuiz = {} as IQuizResponse;
          modifiedQuiz.quizId = quiz.quizId;
          modifiedQuiz.title = quiz.title;
          modifiedQuiz.label = quiz.label;
          modifiedQuiz.comment = quiz.comment;
          modifiedQuiz.quizUserId = quiz.quizUserId;
          modifiedQuiz.testUserId = quiz.quizUserId;
          modifiedQuiz.isClosed = quiz.isClosed;
          return modifiedQuiz;
        })
      );
  }

  getAsssignedQuizzes(testId: string): Observable<IQuizResponse[]> {
    return this.httpClient
      .get<IQuizResponse[]>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testUserPaths.quizTest}/${testId}`
      )
      .pipe();
  }
  // QUIZZES SECTION
  getAvailableQuizzes(userId?: string): Observable<IQuizResponse[]> {
    return this.httpClient
      .get<IQuizResponse[]>(
        userId
          ? `${environment.baseUrl}${environment.apiVersion}${environment.testUserPaths.userQuiz}/${userId}?isParentURL=false`
          : `${environment.baseUrl}${environment.apiVersion}${environment.quizPaths.base}?isParentURL=true`
      )
      .pipe(
        map((quizzes: IQuizResponse[]) => {
          return quizzes.map((quiz) => {
            const modifiedQuiz = {} as IQuizResponse;
            modifiedQuiz.quizId = quiz.quizId;
            modifiedQuiz.title = quiz.title;
            modifiedQuiz.label = quiz.label;
            modifiedQuiz.comment = quiz.comment;
            modifiedQuiz.isClosed = modifiedQuiz.isClosed;
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
          const domains = compositions[1] as any;

          return quizzes.map((quiz) => {
            const quizDomains: any = domains.filter(
              (domain: any) => domain.elementId === quiz.quizId
            )[0];

            return {
              ...quiz,
              domains: quizDomains.domainNames.map(
                (domainName: string, index: number) => {
                  return {
                    domainId: quizDomains.domainId[index],
                    name: domainName,
                  } as IDomain;
                }
              ),
              // subDomains: quizDomains.subDomainNames.map(
              //   (subDomainName: string, index: number) => {
              //     return {
              //       domainId: quizDomains.subDomainId[index],
              //       name: subDomainName,
              //     } as IDomain;
              //   }
              // ),
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
          modifiedQuiz.title = quiz.title;
          modifiedQuiz.label = quiz.label;
          modifiedQuiz.comment = quiz.comment;
          modifiedQuiz.isClosed = modifiedQuiz.isClosed;
          return modifiedQuiz;
        })
      );
  }
  updateQuiz(quizId:string,payload: Patch[]): Observable<IQuizResponse> {
    return this.httpClient
      .patch<IQuizResponse>(
        `${environment.baseUrl}${environment.apiVersion}${environment.quizPaths.base}/${quizId}`,
        payload,
        {
          headers: patchHeaders,
        }
      )
      .pipe(
        map((quiz: IQuizResponse) => {
          const modifiedQuiz = {} as IQuizResponse;
          modifiedQuiz.quizId = quiz.quizId;
          modifiedQuiz.title = quiz.title;
          modifiedQuiz.label = quiz.label;
          modifiedQuiz.comment = quiz.comment;
          modifiedQuiz.isClosed = modifiedQuiz.isClosed;
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
  getQuiz(quizPayload: IQuizResponse): Observable<IQuizResponse> {
    return this.httpClient
      .get<IQuizResponse>(
        `${environment.baseUrl}${environment.apiVersion}${environment.quizPaths.base}/${quizPayload.quizId}`
      )
      .pipe(
        map((quiz) => {
          const modifiedQuiz = {} as IQuizResponse;
          modifiedQuiz.quizId = quiz.quizId;
          modifiedQuiz.title = quiz.title;
          modifiedQuiz.label = quiz.label;
          modifiedQuiz.comment = quiz.comment;
          if (quizPayload.isClosed)
            modifiedQuiz.isClosed = quizPayload.isClosed;
          if (quizPayload.testUserId)
            modifiedQuiz.testUserId = quizPayload.testUserId;
          if (quizPayload.quizUserId)
            modifiedQuiz.quizUserId = quizPayload.quizUserId;
          if (quizPayload.timer) modifiedQuiz.hasTimer = quizPayload.timer;

          return modifiedQuiz;
        }),
        switchMap((newQuiz: IQuizResponse) => {
          const observables = [
            of(newQuiz),
            this.getElementDomain({ id: newQuiz.quizId }, ElementTypes.QUIZ),
          ];
          return forkJoin(observables);
        }),
        map((compositions) => {
          const quiz: IQuizResponse = compositions[0] as IQuizResponse;
          const domains = compositions[1] as any;
          return {
            ...quiz,
            domains: domains.domainNames.map(
              (domainName: string, index: number) => {
                return {
                  domainId: domains.domainId[index],
                  name: domainName,
                } as IDomain;
              }
            ),
            // subDomains: quizDomains.subDomainNames.map(
            //   (subDomainName: string, index: number) => {
            //     return {
            //       domainId: quizDomains.subDomainId[index],
            //       name: subDomainName,
            //     } as IDomain;
            //   }
            // ),
          };
        })
      );
  }
  getAsssignedQuizQuestions(quizId: string): Observable<IQuizQuestion[]> {
    return this.httpClient
      .get<IQuizQuestion[]>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testUserPaths.quizQuestion}/${quizId}?isParentURL=true`
      )
      .pipe();
  }

  getAsssignedQuestions(quizId: string): Observable<IQuestionResponse[]> {
    return this.httpClient
      .get<IQuestionResponse[]>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testUserPaths.quizQuestion}/${quizId}`
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
            modifiedQuestion.title = question.title;
            modifiedQuestion.label = question.label;
            modifiedQuestion.comment = question.comment;
            modifiedQuestion.level = question.level;
            modifiedQuestion.duration = question.duration;
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
          const domains = compositions[1] as any;

          return questions.map((question) => {
            const questionDomains: any = domains.filter(
              (domain: any) => domain.elementId === question.questionId
            )[0];

            return {
              ...question,
              domains: questionDomains.domainNames.map(
                (domainName: string, index: number) => {
                  return {
                    domainId: questionDomains.domainId[index],
                    name: domainName,
                  } as IDomain;
                }
              ),
              // subDomains: questionDomains.subDomainNames.map(
              //   (subDomainName: string, index: number) => {
              //     return {
              //       domainId: questionDomains.subDomainId[index],
              //       name: subDomainName,
              //     } as IDomain;
              //   }
              // ),
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
          modifiedQuestion.title = question.title;
          modifiedQuestion.label = question.label;
          modifiedQuestion.comment = question.comment;
          modifiedQuestion.level = question.level;
          modifiedQuestion.duration = question.duration;
          return modifiedQuestion;
        })
      );
  }
  updateQuestion(questionId:string,payload: Patch[]): Observable<IQuestionResponse> {
    return this.httpClient
      .patch<IQuestionResponse>(
        `${environment.baseUrl}${environment.apiVersion}${environment.questionPaths.base}/${questionId}`,
        payload,
        {
          headers: headers,
        }
      )
      .pipe(
        map((question: IQuestionResponse) => {
          const modifiedQuestion = {} as IQuestionResponse;
          modifiedQuestion.questionId = question.questionId;
          modifiedQuestion.title = question.title;
          modifiedQuestion.label = question.label;
          modifiedQuestion.comment = question.comment;
          modifiedQuestion.level = question.level;
          modifiedQuestion.duration = question.duration;
          return modifiedQuestion;
        })
      );
  }
  deleteQuestion(questionId: string): Observable<IQuestionResponse> {
    return this.httpClient.delete<IQuestionResponse>(
      `${environment.baseUrl}${environment.apiVersion}${environment.questionPaths.base}/${questionId}`
    );
  }

  getQuestion(questionPayload: any): Observable<IQuestionResponse> {
    return this.httpClient
      .get<IQuestionResponse>(
        questionPayload.quizUserId
          ? `${environment.baseUrl}${environment.apiVersion}${environment.questionPaths.base}/${questionPayload.questionId}?quizUserId=${questionPayload.quizUserId}`
          : `${environment.baseUrl}${environment.apiVersion}${environment.questionPaths.base}/${questionPayload.questionId}`
      )
      .pipe(
        map((question) => ({
          ...question,
          questionUserId: questionPayload.questionUserId,
          quizUserId: questionPayload.quizUserId,
        }))
      );
  }
  getUserQuestions(quizUserId: string): Observable<any> {
    return this.httpClient
      .get<any>(
        `${environment.baseUrl}${environment.apiVersion}${environment.questionPaths.userQuestion}/${quizUserId}?isParentURL=true`
      );
  }

  //OTHERS
  getCategories(): Observable<IDomain[]> {
    return this.httpClient.get<IDomain[]>(
      `${environment.baseUrl}${environment.apiVersion}${environment.categoryPaths.base}`
    );
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
