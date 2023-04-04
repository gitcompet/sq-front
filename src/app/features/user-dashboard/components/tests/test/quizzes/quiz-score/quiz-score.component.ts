import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IQuizScore } from 'src/app/core/models/quiz-score.model';
import { CandidateService } from 'src/app/features/user-admin/services/candiate.service';
import { QuizService } from 'src/app/features/user-admin/services/quiz.service';

@Component({
  selector: 'app-quiz-score',
  templateUrl: './quiz-score.component.html',
  styleUrls: ['./quiz-score.component.css'],
})
export class QuizScoreComponent implements OnInit {
  id: string = '';
  userScore: IQuizScore = {} as IQuizScore;
  constructor(private candidateService: CandidateService, private router: Router) {
    this.id = this.router.getCurrentNavigation()?.extras.state as any;
  }
  ngOnInit(): void {
    this.candidateService
      .getUserScore(this.id)
      .subscribe((result) => (this.userScore = result));
  }
}
