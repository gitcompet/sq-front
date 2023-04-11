import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ITestResponse } from 'src/app/core/models/test-response.model';
import { extractName } from 'src/app/core/constants/settings';
import { QuizService } from 'src/app/features/user-admin/services/quiz.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { switchMap, of, forkJoin, Subscription, Observable, map } from 'rxjs';
import { IQuizResponse } from 'src/app/core/models/quiz-response.model';
import { ITestQuiz } from 'src/app/core/models/test-quiz-assign.model';
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements OnInit, OnDestroy {
  isExpanded: boolean = false;
  isAdmin: boolean = false;
  extractName = extractName;
  _subscriptions: Subscription[] = [];

  @Input() data!: ITestResponse;
  quizzes: Observable<IQuizResponse[] | undefined>;
  constructor(
    private quizService: QuizService,
    private modalService: ModalService,
    private authService: AuthService
  ) {
    this.quizzes = new Observable<IQuizResponse[]>();
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
  }
  toggle() {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
      if (this.isAdmin) {
        this.quizzes = this.quizService
          .getAsssignedTestQuizzes(this.data.testUserId)
          .pipe(
            switchMap((compositions: ITestQuiz[]) => {
              const filtredComposition = compositions.map(
                (testQuiz) => testQuiz.quizId
              );
              const quizzesObs = forkJoin(
                filtredComposition.map((quizId) =>
                  this.quizService.getQuiz({
                    quizId: quizId,
                    testUserId: this.data.testUserId,
                  } as IQuizResponse)
                )
              );
              const observables = [quizzesObs, of(compositions)];
              return forkJoin(observables);
            })
          )
          .pipe(
            map((quizzesRes) => {
              const qzs = quizzesRes[0] as IQuizResponse[];
              const compose = quizzesRes[1] as ITestQuiz[];
              const updateQuizzes = qzs.map((quiz) => {
                const currentQuiz = compose.find(
                  (testQuiz) => testQuiz.quizId === quiz.quizId
                );
                return {
                  ...quiz,
                  isClosed: currentQuiz? currentQuiz.isClosed : false,
                  hasTimer: currentQuiz? currentQuiz.timer: false,
                };
              });
              this.data = {
                ...this.data,
                quizzes: updateQuizzes,
              };

              return this.data.quizzes;
            })
          );
      } else {
        this.quizzes = this.quizService
          .getUserQuizzes(this.data.testUserId)
          .pipe(
            map((quizzesRes) => {
              this.data = {
                ...this.data,
                quizzes: quizzesRes,
              };

              return this.data.quizzes;
            })
          );
      }
    }
  }
  onUpdateTest() {
    this.modalService.updateData(this.data);
    this.modalService.openModal({
      id: 'updateTestModal',
    });
  }
  onDeleteTest() {
    this.modalService.updateData(this.data);
    this.modalService.openModal({
      id: 'confirmationModal',
    });
  }
  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }
}
