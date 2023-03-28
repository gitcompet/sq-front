import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { extractName } from 'src/app/core/constants/settings';
import { IQuestionResponse } from 'src/app/core/models/question-response.model';
import { IQuizResponse } from 'src/app/core/models/quiz-response.model';
import { QuizService } from 'src/app/features/user-admin/services/quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnInit, OnDestroy, AfterViewInit {
  isExpanded: boolean = false;
  @Input() isAdmin!: boolean;
  @Input() data!: IQuizResponse;
  @Input() relatedQuizQuestions!: IQuestionResponse[] | undefined;
  questions: IQuestionResponse[] = [];
  _subscriptions: Subscription[] = [];
  extractName = extractName;
  constructor(
    private quizService: QuizService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngAfterViewInit(): void {}
  toggle() {
    this.isExpanded = !this.isExpanded;
  }
  ngOnInit(): void {
    if (this.isAdmin) {
      this.route.fragment.subscribe((f) => {
        const element = document.querySelector('#el-' + f);
        if (element) {
          element.scrollIntoView({ block: 'end', behavior: 'smooth' });
          const elementContent = document.querySelector('#el-content' + f);
          elementContent?.classList.add('max-h-40');
        }
      });
      this._subscriptions.push(
        this.quizService
          .getAvailableQuestions()
          .subscribe((res: IQuestionResponse[]) => {
            this.questions = res;
          })
      );
    }
    if (
      this.router.url.includes('/admin/quizzes') &&
      this.relatedQuizQuestions
    ) {
      this.questions = this.relatedQuizQuestions;
    }
  }
  ngOnDestroy(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
