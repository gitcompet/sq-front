import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, of, Subscription, switchMap } from 'rxjs';
import { IDomain } from 'src/app/core/models/domain.model';
import { OperationType, Patch } from 'src/app/core/models/patch.model';
import { IQuizResponse } from 'src/app/core/models/quiz-response.model';
import { IQuiz } from 'src/app/core/models/quiz.model';
import { ITestQuiz } from 'src/app/core/models/test-quiz-assign.model';
import {
  ITestResponse,
  TestResponse,
} from 'src/app/core/models/test-response.model';
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
  testUpdateForm: FormGroup
  showModal: boolean = false;
  testQuizzes: IQuizResponse[] = [];
  data: unknown;
  quizzesIds: string[] = [];
  quizActions: unknown[] = [
    { actionName: 'select', componentName: CheckBoxComponent },
  ];
  tests: ITestResponse[] = [];
  headers: string[] = ['Name', 'Category', 'Action'];
  quizHeaders: string[] = ['Id','Name','Category', 'Action'];
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
    this.testUpdateForm = this._formBuilder.group({
      title: this._formBuilder.control('', [Validators.required]),
      categories: this._formBuilder.control('', Validators.required),
    });
  }
  ngOnDestroy(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }
  ngOnInit(): void {
    this._subscriptions.push(
      this.modalService.getDataExchange().subscribe((data: any) => {
        if (data && Object.hasOwn(data, 'testId')) {
          this.data = data.testId;
          this.testUpdateForm.patchValue(data);
          this.categories = data.categoryNames;
          this.testUpdateForm.patchValue({categories:data.categoryNames});
          this.testUpdateForm.updateValueAndValidity();
        }
      })
    );
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
    this.quizService
      .getCategories()
      .subscribe((res) => (this.categories = res));
    this.showModal = !this.showModal;
    this.modalService.openModal({ id: 'testModal', isShown: this.showModal });
  }
  createTest(form: FormGroup) {
    this.newTest = {
      ...this.newTest,
      testCategoryId: form.get('categories')?.value, // form.get('categories').value array of categories
      title: form.get('title')?.value,
      comment: ''
    } as ITest;
    this.quizService
      .addTest(this.newTest)
      .pipe(
        switchMap((newTest: ITestResponse) => {
          this.tests = [...this.tests, newTest];
          return this.quizzesIds.length > 0 ? forkJoin(
            this.quizzesIds.map((quizId) =>
              this.quizService.assignQuiz({
                quizId: quizId,
                testId: newTest.testId,
              })
            )
          ) : of();
        })
      )
      .subscribe((response) => {
        this.modalService.closeModal({
          id: 'testModal',
          isShown: this.showModal,
        });
      });
  }

  updateTest(form: FormGroup) {
    console.log(form.controls); return;

    if (!form.valid) return;
    const controls = form.controls;
    const patches: Patch[] = Object.entries(controls).map((entry) => ({
      path: `/${entry[0]}`,
      op: OperationType.REPLACE,
      value: entry[1].value,
    }));


    this.quizService
      .updateTest(patches)
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
          id: 'updateTestModal',
          isShown: this.showModal,
        });
      });
  }
  deleteTest() {
    if(this.data){
      this.quizService.deleteTest(this.data as string).subscribe((res)=>{
        this.tests = this.tests.filter((test)=> test.testId !== res.testId);
        this.modalService.closeModal({ id: 'confirmationModal', isShown: false });
      });
    }
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
