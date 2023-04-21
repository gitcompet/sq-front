import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  catchError,
  forkJoin,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
  zip,
} from 'rxjs';
import { headers, patchHeaders } from 'src/app/core/constants/settings';
import { IQuestion } from 'src/app/core/models/question.model';
import { IQuiz } from 'src/app/core/models/quiz.model';
import { ITest } from 'src/app/core/models/test.model';
import { ITestResponse } from 'src/app/core/models/test-response.model';
import { environment } from 'src/environments/environment.development';
import {
  IQuizDashboard,
  IQuizResponse,
} from 'src/app/core/models/quiz-response.model';
import { IQuestionResponse } from 'src/app/core/models/question-response.model';
import { ITestUserResponse } from 'src/app/core/models/test-user-response.model';
import { ITestQuiz } from 'src/app/core/models/test-quiz-assign.model';
import { IQuizQuestion } from 'src/app/core/models/quiz-question-assign.model copy';
import {
  ElementTypes,
  IDomain,
  QuizStatus,
} from 'src/app/core/models/domain.model';
import { Patch } from 'src/app/core/models/patch.model';
import { UserService } from '../../user-profile/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  constructor(
    private httpClient: HttpClient,
    private userService: UserService
  ) {}

  // TESTS SECTION
  getAvailableTests(): Observable<ITestResponse[]> {
    return this.httpClient
      .get<ITestResponse[]>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testPaths.base}`
      )
      .pipe(
        switchMap((tests) =>
          forkJoin(tests.map((test) => this.getTest(test.testId)))
        )
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
        }),
        switchMap((newTest: ITestResponse) => {
          const observables = [
            of(newTest),
            this.getTestCategories(newTest.testId),
          ];
          return forkJoin(observables);
        }),

        map((compositions) => {
          const test: ITestResponse = compositions[0] as ITestResponse;
          const categories = compositions[1] as any;
          return {
            ...test,
            testCategoryComposeId: categories.testCategoryComposeId,
            categories: categories.categoryNames.map(
              (categoryName: string, index: number) => {
                return {
                  domainId: categories.testCategoryId[index],
                  name: categoryName,
                  domainComposeId: categories.testCategoryComposeId[index],
                } as IDomain;
              }
            ),
          };
        })
      );
  }
  unAssignCategoriesTest(
    testCategoryComposeId: string
  ): Observable<ITestResponse> {
    return this.httpClient.delete<ITestResponse>(
      `${environment.baseUrl}${environment.apiVersion}${environment.testPaths.testCategories}/${testCategoryComposeId}`
    );
  }

  getUserTests(userId: string, isParent?:boolean): Observable<ITestResponse[]> {
    return this.httpClient
      .get<ITestUserResponse[]>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testUserPaths.base}/${userId}?${isParent ?'isParentURL='+ isParent : 'true'}`
      )
      .pipe(
        switchMap((userTests: ITestUserResponse[]) => {
          if(!Array.isArray(userTests)) userTests = [userTests];
          const testIds = userTests.map(
            (userTest: ITestUserResponse) => userTest.testId
          );
          const observables = [
            forkJoin(testIds.map((id: string) => this.getTest(id))),
            of(userTests),
          ];
          return forkJoin(observables);
        }),

        switchMap((newTests) => {
          const tests = newTests[0] as ITestResponse[];
          const userTest = newTests[1] as unknown;

          const testsObervables: Observable<ITestResponse>[] = tests.map(
            (newTest: ITestResponse) => this.getTestCategories(newTest.testId)
          );
          const observables = [
            of(tests),
            forkJoin(testsObervables),
            of(userTest),
          ];
          return forkJoin(observables);
        }),
        switchMap((tests) => {
          const ts = tests[0] as ITestResponse[];
          const categories = tests[1] as ITestResponse[];
          const userTests = tests[2] as any;
          
          
          return of(
            ts.map((test, index) => {
              const testCatgories: any = categories.filter(
                (category: any) => category.testId === test.testId
              )[0];
              return {
                ...test,
                userId: userTests.map((test: any) => test.loginId)[index],
                testUserId: userTests.map((test: any) => test.testUserId)[
                  index
                ],
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
        switchMap((newTest: ITestResponse) => {
          return this.getTest(newTest.testId);
        })
      );
  }

  updateTest(testId: string, payload: Patch[]): Observable<ITestResponse> {
    return this.httpClient
      .patch<ITestResponse>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testPaths.base}/${testId}`,
        payload,
        {
          headers: patchHeaders,
        }
      )
      .pipe(
        switchMap((newTest: ITestResponse) => {
          return this.getTest(newTest.testId);
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
        switchMap((quizzes) => {
          return forkJoin(quizzes.map((quiz) => this.getQuiz(quiz)));
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
      .pipe(switchMap((quiz) => this.getQuiz(quiz)));
  }
  updateQuiz(quizId: string, payload: Patch[]): Observable<IQuizResponse> {
    return this.httpClient
      .patch<IQuizResponse>(
        `${environment.baseUrl}${environment.apiVersion}${environment.quizPaths.base}/${quizId}`,
        payload,
        {
          headers: patchHeaders,
        }
      )
      .pipe(switchMap((newQuiz) => this.getQuiz(newQuiz)));
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

  getLastestQuizzes(
    status: QuizStatus,
    amount?: number
  ): Observable<IQuizDashboard[]> {
    return this.httpClient
      .get<any>(
        `${environment.baseUrl}${environment.apiVersion}${
          environment.dashboardPaths.base
        }${environment.dashboardPaths.latestQuizzes}?done=${status}${
          amount ? '&amount=' + amount : ''
        }`
      )
      .pipe(
        switchMap((quizzes) =>
          forkJoin([
            forkJoin(quizzes.map((quiz: IQuizResponse) => this.getQuiz(quiz))),
            forkJoin(
              quizzes.flatMap((quiz: IQuizResponse) =>
                this.getUserTests(quiz.testUserId!,false)
              )
            ),
            of(quizzes),
          ])
        ),
        switchMap((response) => {
          let tests = response[1] as ITestResponse[];
          tests = tests.flat(1)
          const usrObs = forkJoin(
            tests.flatMap((test: any) =>
              this.userService.getProfile(test.userId)
            )
          );
          return zip(of(response[0]), of(response[1]), of(response[2]), usrObs);
        }),
        map((response) => {
          const quizzes = response[0] as IQuizResponse[];
          const tests = response[1] as ITestResponse[];
          const latestQuizzes = response[2];
          const users = response[3];
         
          
          return quizzes.map(
            (quiz, index) =>
              ({
                title: quiz.title,
                comment: quiz.comment,
                userName: users[index].lastName,
                score: (latestQuizzes[index].score / 100) * 10,                
                testName: tests.find((test) =>
                  latestQuizzes.findIndex(
                    (ts: ITestResponse) => ts.testUserId === test.testUserId
                  )
                )?.title,
              } as IQuizDashboard)
          );
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
          modifiedQuiz.isClosed = quizPayload.isClosed;
          modifiedQuiz.hasTimer = quizPayload.timer!;
          if (quizPayload.testUserId)
            modifiedQuiz.testUserId = quizPayload.testUserId;
          if (quizPayload.quizUserId)
            modifiedQuiz.quizUserId = quizPayload.quizUserId;
          return modifiedQuiz;
        }),
        switchMap((newQuiz: IQuizResponse) => {
          const observables = [
            of(newQuiz),
            this.getElementDomain({ id: newQuiz.quizId }, ElementTypes.QUIZ),
            this.getElementSubDomain({ id: newQuiz.quizId }, ElementTypes.QUIZ),
          ];
          return forkJoin(observables);
        }),
        map((compositions) => {
          const quiz: IQuizResponse = compositions[0] as IQuizResponse;
          const domains = compositions[1] as any;
          const subDomains = compositions[2] as any;
          return {
            ...quiz,
            quizDomainComposeId: domains.domainComposeId,
            domains: domains.domainNames.map(
              (domainName: string, index: number) => {
                return {
                  domainId: domains.domainId[index],
                  name: domainName,
                  domainComposeId: domains.domainComposeId[index],
                } as IDomain;
              }
            ),
            quizsubDomainComposeId: subDomains.subDomainComposeId,
            subDomains: subDomains.subDomainNames.map(
              (subDomainName: string, index: number) => {
                return {
                  domainId: subDomains.subDomainId[index],
                  name: subDomainName,
                  subDomainComposeId: subDomains.subDomainComposeId[index],
                } as IDomain;
              }
            ),
          } as IQuizResponse;
        })
      );
  }
  getAsssignedQuizQuestions(quizId: string): Observable<IQuestionResponse[]> {
    return this.httpClient
      .get<IQuestionResponse[]>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testUserPaths.quizQuestion}/${quizId}?isParentURL=true`
      )
      .pipe(
        switchMap((quizQuestions) =>
          forkJoin(
            quizQuestions.map((quizQuestion) =>
              this.getQuestion({ questionId: quizQuestion.questionId })
            )
          )
        )
      );
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
        switchMap((questions) =>
          forkJoin(questions.map((question) => this.getQuestion(question)))
        )
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
      .pipe(switchMap((question) => this.getQuestion(question)));
  }
  updateQuestion(
    questionId: string,
    payload: Patch[]
  ): Observable<IQuestionResponse> {
    return this.httpClient
      .patch<IQuestionResponse>(
        `${environment.baseUrl}${environment.apiVersion}${environment.questionPaths.base}/${questionId}`,
        payload,
        {
          headers: headers,
        }
      )
      .pipe(switchMap((question) => this.getQuestion(question)));
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
        })),
        switchMap((newQuestion: IQuestionResponse) => {
          const observables = [
            of(newQuestion),
            this.getElementDomain(
              { id: newQuestion.questionId },
              ElementTypes.QUESTION
            ),
            this.getElementSubDomain(
              { id: newQuestion.questionId },
              ElementTypes.QUESTION
            ),
          ];
          return forkJoin(observables);
        }),
        map((compositions) => {
          const quiz: IQuestionResponse = compositions[0] as IQuestionResponse;
          const domains = compositions[1] as any;
          const subDomains = compositions[2] as any;
          return {
            ...quiz,
            quizDomainComposeId: domains.domainComposeId,
            domains: domains.domainNames.map(
              (domainName: string, index: number) => {
                return {
                  domainId: domains.domainId[index],
                  name: domainName,
                  domainComposeId: domains.domainComposeId[index],
                } as IDomain;
              }
            ),
            quizsubDomainComposeId: subDomains.subDomainComposeId,
            subDomains: subDomains.subDomainNames.map(
              (subDomainName: string, index: number) => {
                return {
                  domainId: subDomains.subDomainId[index],
                  name: subDomainName,
                  subDomainComposeId: subDomains.subDomainComposeId[index],
                } as IDomain;
              }
            ),
          };
        })
      );
  }
  getUserQuestions(quizUserId: string): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.baseUrl}${environment.apiVersion}${environment.questionPaths.userQuestion}/${quizUserId}?isParentURL=true`
    );
  }

  //OTHERS
  getCategories(): Observable<IDomain[]> {
    return this.httpClient.get<IDomain[]>(
      `${environment.baseUrl}${environment.apiVersion}${environment.categoryPaths.base}`
    );
  }
  addCategories(payload: any): Observable<ITestResponse> {
    return this.httpClient
      .post<ITestResponse>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testPaths.testCategories}`,
        payload,
        {
          headers: headers,
        }
      )
      .pipe(switchMap((test) => this.getTest(test.testId)));
  }

  updateCategories(id: string, payload: Patch[]): Observable<ITestResponse> {
    return this.httpClient
      .patch<ITestResponse>(
        `${environment.baseUrl}${environment.apiVersion}${environment.testPaths.testCategories}/${id}`,
        payload,
        {
          headers: patchHeaders,
        }
      )
      .pipe(switchMap((test) => this.getTest(test.testId)));
  }
  updateQuizDomains(id: string, payload: Patch[]): Observable<any> {
    return this.httpClient
      .patch<any>(
        `${environment.baseUrl}${environment.apiVersion}${environment.categoryPaths.domainCompose}/${id}`,
        payload,
        {
          headers: patchHeaders,
        }
      )
      .pipe();
  }
  addQuizDomains(payload: any): Observable<any> {
    return this.httpClient
      .post<any>(
        `${environment.baseUrl}${environment.apiVersion}${environment.categoryPaths.domainCompose}`,
        payload,
        {
          headers: patchHeaders,
        }
      )
      .pipe();
  }

  updateQuestionDomains(id: string, payload: Patch[]): Observable<any> {
    return this.httpClient
      .patch<any>(
        `${environment.baseUrl}${environment.apiVersion}${environment.categoryPaths.domainCompose}/${id}`,
        payload,
        {
          headers: patchHeaders,
        }
      )
      .pipe();
  }

  addQuestionDomains(payload: any): Observable<any> {
    return this.httpClient
      .post<any>(
        `${environment.baseUrl}${environment.apiVersion}${environment.categoryPaths.domainCompose}`,
        payload,
        {
          headers: patchHeaders,
        }
      )
      .pipe();
  }
  getElementDomain(element: any, type: string): Observable<any[]> {
    return this.httpClient
      .get<any[]>(
        `${environment.baseUrl}${environment.apiVersion}${environment.categoryPaths.domainCompose}/${element.id}`,
        { params: new HttpParams().set('type', type) }
      )
      .pipe();
  }
  getElementSubDomain(element: any, type: string): Observable<any[]> {
    return this.httpClient
      .get<any[]>(
        `${environment.baseUrl}${environment.apiVersion}${environment.categoryPaths.subDomainCompose}/${element.id}`,
        { params: new HttpParams().set('type', type) }
      )
      .pipe();
  }
}
