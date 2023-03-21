import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';
import { headers } from 'src/app/core/constants/settings';
import { IQuestion } from 'src/app/core/models/question.model';
import { IQuiz } from 'src/app/core/models/quiz.model';
import { ITest } from 'src/app/core/models/test.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  constructor(private httpClient: HttpClient) {}
  getAvailableTests(): Observable<ITest[]> {
    return this.httpClient.get<ITest[]>(
      `${environment.baseUrl}${environment.apiVersion}${environment.testPaths.base}`
    ).pipe(
      map((quizzes: ITest[]) => {
        return quizzes.map((test) => {
          const modifiedTest = {} as ITest;
          modifiedTest.testId = test.testId;
          modifiedTest.testCategoryId = test.testCategoryId;
          modifiedTest.comment = test.comment;
          return modifiedTest;
        });
      })
    );
  }
  getAvailableQuizzes(): Observable<IQuiz[]> {
    return this.httpClient
      .get<IQuiz[]>(
        `${environment.baseUrl}${environment.apiVersion}${environment.quizPaths.base}`
      )
      .pipe(
        map((quizzes: IQuiz[]) => {
          return quizzes.map((quiz) => {
            const modifiedQuiz = {} as IQuiz;
            modifiedQuiz.quizId = quiz.quizId;
            modifiedQuiz.subDomainId = quiz.subDomainId;
            modifiedQuiz.title = quiz.title;
            modifiedQuiz.comment = quiz.comment;
            return modifiedQuiz;
          });
        })
      );
  }
  getAvailableQuestion(): Observable<IQuestion[]> {
    return this.httpClient.get<IQuestion[]>(
      `${environment.baseUrl}${environment.apiVersion}${environment.questionPaths.base}`
    )      .pipe(
      map((quizzes: IQuestion[]) => {
        return quizzes.map((question) => {
          const modifiedQuestion = {} as IQuestion;
          modifiedQuestion.questionId = question.questionId;
          modifiedQuestion.subDomainId = question.subDomainId;
          modifiedQuestion.title = question.title;
          modifiedQuestion.level = question.level;
          return modifiedQuestion;
        });
      })
    );;
  }
  addTest(payload: ITest):Observable<ITest>{
     return  this.httpClient.post<ITest>(
      `${environment.baseUrl}${environment.apiVersion}${environment.testPaths.base}`,
       payload,
       {
        headers: headers
       }
    ).pipe(
      map((test: ITest) => {
        const modifiedTest = {} as ITest;
        modifiedTest.testId = test.testId;
        modifiedTest.testCategoryId = test.testCategoryId;
        modifiedTest.comment = test.comment;
        return modifiedTest;
      })
    );
  }

  addQuiz(payload: IQuiz):Observable<IQuiz>{
    console.log(payload);

    return  this.httpClient.post<IQuiz>(
     `${environment.baseUrl}${environment.apiVersion}${environment.quizPaths.base}`,
      payload,
      {
       headers: headers
      }
   ).pipe(
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
}
