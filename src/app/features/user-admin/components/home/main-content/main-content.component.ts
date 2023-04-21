import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../../services/quiz.service';
import { IQuizDashboard, IQuizResponse } from 'src/app/core/models/quiz-response.model';
import { Observable } from 'rxjs';
import { QuizStatus } from 'src/app/core/models/domain.model';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css']
})
export class MainContentComponent implements OnInit{
  lastestCompletedQuizzes: Observable<IQuizDashboard[]> = new Observable();
  lastestPendingQuizzes: Observable<IQuizDashboard[]> = new Observable();
  quizHeaders: string[]= ['Title','Test Name','Assigned To','Score(%)']
  constructor(private quizService: QuizService){}
  ngOnInit(): void {
    this.lastestCompletedQuizzes = this.quizService.getLastestQuizzes(QuizStatus.COMPLETED);
    this.lastestPendingQuizzes = this.quizService.getLastestQuizzes(QuizStatus.PENDING);
  }

}
