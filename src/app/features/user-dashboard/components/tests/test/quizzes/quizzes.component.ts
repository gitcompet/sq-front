import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of, Subscription, switchMap } from 'rxjs';
import { IQuestionResponse } from 'src/app/core/models/question-response.model';
import { IQuizQuestion } from 'src/app/core/models/quiz-question-assign.model copy';
import { IQuizResponse } from 'src/app/core/models/quiz-response.model';
import { QuizService } from 'src/app/features/user-admin/services/quiz.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.css'],
})
export class QuizzesComponent implements OnInit, OnChanges {
  quizzes: IQuizResponse[] = [];
  @Input() relatedTestQuizzes!: IQuizResponse[] | null | undefined;
  isAdmin: boolean = false;
  _subscriptions: Subscription[] = [];
  constructor(
    private modalService: ModalService,
    private quizService: QuizService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this._subscriptions.push(this.modalService.getDataExchange().subscribe());
    if(this.isAdmin){
      this.quizService.getAvailableQuizzes(this.authService.getId()).subscribe();
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['relatedTestQuizzes']) {
      this.quizzes = changes['relatedTestQuizzes'].currentValue;
    }
  }
  quizDetails(quizId: any) {
    if (this.isAdmin) {
      const quizUrl = this.router.createUrlTree(['..', 'quizzes', quizId], {
        fragment: quizId,
        relativeTo: this.route,
      });
      this.router.navigateByUrl(quizUrl);
    }
  }
  ngOnDestroy(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
