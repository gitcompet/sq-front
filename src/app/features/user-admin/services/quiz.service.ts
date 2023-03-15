import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Quiz } from 'src/app/core/models/quiz.model';


@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private httpClient: HttpClient) { }

  getAvailableQuizzes(): Observable<Quiz[]>{
    return this.httpClient.get<Quiz[]>("");
  }
}
