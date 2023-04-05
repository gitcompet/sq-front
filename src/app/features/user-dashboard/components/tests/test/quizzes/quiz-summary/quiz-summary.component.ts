import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationType, Patch } from 'src/app/core/models/patch.model';
import { IQuestionResponse } from 'src/app/core/models/question-response.model';
import { IQuizResponse } from 'src/app/core/models/quiz-response.model';
import { CandidateService } from 'src/app/features/user-admin/services/candiate.service';
import { QuizService } from 'src/app/features/user-admin/services/quiz.service';

@Component({
  selector: 'app-quiz-summary',
  templateUrl: './quiz-summary.component.html',
  styleUrls: ['./quiz-summary.component.css'],
})
export class QuizSummaryComponent implements OnInit {
  questions: IQuestionResponse[] = [];
  quiz:IQuizResponse;
  constructor(
    private candidateService: CandidateService,
    private quizService: QuizService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.quiz = this.router.getCurrentNavigation()?.extras.state as IQuizResponse;
  }
  ngOnInit(): void {
    this.quizService.getAsssignedQuizQuestions(this.quiz.quizId).subscribe((res) => {
      console.log(res);

    });
  }
  validateQuiz(){
    const patches = [
      {
        op: OperationType.REPLACE,
        path: '/isClosed',
        value: true
      } as Patch
    ]
    this.candidateService.updateUserQuiz(patches, this.quiz.quizUserId!).subscribe((res)=>{
      console.log(res);
      this.router.navigate(['/score'], {
        relativeTo: this.route,
        state: this.quiz,
      });
    })
  }
}
