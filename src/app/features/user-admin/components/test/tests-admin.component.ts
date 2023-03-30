import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  forkJoin,
  of,
  Subscription,
  switchMap,
} from 'rxjs';
import { IDomain } from 'src/app/core/models/domain.model';
import { IQuizResponse } from 'src/app/core/models/quiz-response.model';
import { IQuiz } from 'src/app/core/models/quiz.model';
import { ITestQuiz } from 'src/app/core/models/test-quiz-assign.model';
import { ITestResponse } from 'src/app/core/models/test-response.model';
import { ITest } from 'src/app/core/models/test.model';
import { CheckBoxComponent } from 'src/app/shared/components/checkbox/checkbox.component';
import { ModalService } from 'src/app/shared/services/modal.service';
import { QuizService } from '../../services/quiz.service';

@Component({
  selector: 'app-admin-tests',
  templateUrl: './tests-admin.component.html',
  styleUrls: ['./tests-admin.component.css'],
})
export class TestsAdminComponent implements OnInit, OnDestroy {
  testForm: FormGroup;
  showModal: boolean = false;
  testQuizzes: IQuizResponse[] = [];
  quizzesIds: string[] = [];
  quizActions: unknown[] = [
    { actionName: 'select', componentName: CheckBoxComponent },
  ];
  tests: ITestResponse[] = [];
  headers: string[] = ['Name', 'Category', 'Action'];
  quizHeaders: string[] = ['Name', 'Category', 'Sub Category', 'Action'];
  categories: IDomain[] = [];
  _subscriptions: Subscription[] = [];
  newTest: ITest = {} as ITest;
  constructor(
    private _formBuilder: FormBuilder,
    private modalService: ModalService,
    private quizService: QuizService
  ) {
    this.testForm = this._formBuilder.group({
      title: this._formBuilder.control('', [Validators.required]),
      categories: this._formBuilder.control('', Validators.required),
    });
  }
  ngOnDestroy(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }
  ngOnInit(): void {
    this._subscriptions.push(this.modalService.getDataExchange().subscribe());
    this._subscriptions.push(
      this.quizService
        .getAvailableQuizzes()
        .subscribe((quizzes: IQuizResponse[]) => {
          if (quizzes && quizzes.length > 0) {
            this.testQuizzes = quizzes;
            this.modalService.updateData(this.testQuizzes);
          }
        })
    );
  }
  onAddTest() {
    this.quizService.getCategories().subscribe((res)=>this.categories = res);
    this.showModal = !this.showModal;
    this.modalService.openModal({ id: 'testModal', isShown: this.showModal });
  }
  createTest(form: FormGroup) {
    this.newTest = {
      ...this.newTest,
      testCategoryId: form.get('categories')?.value, // form.get('categories').value array of categories
      title: form.get('title')?.value,
    } as ITest;
    this.quizService
      .addTest(this.newTest)
      .pipe(
        switchMap((newTest: ITestResponse) => {
          this.tests = [...this.tests, newTest];
          return forkJoin(
            this.quizzesIds.map((quizId) =>
              this.quizService.assignQuiz({
                quizId: quizId,
                testId: newTest.testId,
              })
            )
          );
        })
      )
      .subscribe((response) => {
        this.modalService.closeModal({
          id: 'testModal',
          isShown: this.showModal,
        });
      });
  }
  selectQuizzes() {
    this.modalService.openModal({ id: 'quizModal', isShown: true });
  }
  assignQuizzes() {
    this.modalService.closeModal({ id: 'quizModal', isShown: this.showModal });
  }

  onChecked(event: any) {
    if (event.target.checked) {
      this.quizzesIds.push(event.target.defaultValue);
    }
  }
}
