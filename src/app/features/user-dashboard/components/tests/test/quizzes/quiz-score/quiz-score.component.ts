import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IQuizResponse } from 'src/app/core/models/quiz-response.model';
import { IQuizScore } from 'src/app/core/models/quiz-score.model';
import { CandidateService } from 'src/app/features/user-admin/services/candiate.service';
import { QuizService } from 'src/app/features/user-admin/services/quiz.service';

@Component({
  selector: 'app-quiz-score',
  templateUrl: './quiz-score.component.html',
  styleUrls: ['./quiz-score.component.css'],
})
export class QuizScoreComponent implements OnInit {
  quiz: IQuizResponse;
  userScore: IQuizScore = {} as IQuizScore;
  constructor(
    private candidateService: CandidateService,
    private router: Router
  ) {
    this.quiz = this.router.getCurrentNavigation()?.extras
      .state as IQuizResponse;
  }
  ngOnInit(): void {
    this.candidateService
      .getQuizScore(this.quiz.quizUserId!)
      .subscribe((result) => {
        const scorePercentage =
          (result.quizScore * 100) / this.quiz.questions.length;
        this.userScore = {
          ...this.userScore,
          quizScore: scorePercentage,
        };
      });
  }
}
