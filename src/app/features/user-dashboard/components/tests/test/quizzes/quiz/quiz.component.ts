import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, forkJoin, map, switchMap } from 'rxjs';
import { extractName } from 'src/app/core/constants/settings';
import { IQuestionResponse } from 'src/app/core/models/question-response.model';
import { IQuizResponse } from 'src/app/core/models/quiz-response.model';
import { QuizService } from 'src/app/features/user-admin/services/quiz.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { IQuizQuestion } from '../../../../../../../core/models/quiz-question-assign.model copy';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnInit, OnDestroy {
  isExpanded: boolean = false;
  @Input() isAdmin!: boolean;
  @Input() data!: IQuizResponse;
  relatedQuizQuestions: Observable<IQuestionResponse[] | undefined>;
  questions: IQuestionResponse[] = [];
  _subscriptions: Subscription[] = [];
  extractName = extractName;
  constructor(
    private quizService: QuizService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: ModalService
  ) {
    this.relatedQuizQuestions = new Observable<IQuestionResponse[]>();
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
    }
  }

  toggle() {
    this.isExpanded = !this.isExpanded;

    if (this.isExpanded) {
      this._subscriptions.push(
        this.quizService

          .getAsssignedQuizQuestions(this.data.quizId)
          .pipe(
            switchMap((compositions: IQuizQuestion[]) => {
              const filtredComposition = compositions.map(
                (quizQuestion) => quizQuestion.questionId
              );

              return forkJoin(
                filtredComposition.map((questionId) =>
                  this.quizService.getQuestion({
                    questionId: questionId,
                  } as IQuestionResponse)
                )
              );
            }),

            map((questionRes) => {
              this.data = {
                ...this.data,
                questions: questionRes,
              };
            })
          )
          .subscribe()
      );
    }
  }
  onUpdateQuiz() {
    this.modalService.updateData(this.data);
    this.modalService.openModal({
      id: 'updateQuizModal',
    });
  }
  onDeleteQuiz() {
    this.modalService.updateData(this.data);
    this.modalService.openModal({
      id: 'confirmationModal',
    });
  }
  takeQuiz(selectedQuiz: IQuizResponse) {
    const selectedQuizUrl = this.router.createUrlTree(
      ['../..', 'quiz', selectedQuiz.quizId],
      {
        relativeTo: this.route,
      }
    );
    this.router.navigateByUrl(selectedQuizUrl, { state: selectedQuiz });
  }
  ngOnDestroy(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
