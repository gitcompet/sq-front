import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, switchMap } from 'rxjs';
import { IQuiz } from 'src/app/core/models/quiz.model';
import { ITest, Test } from 'src/app/core/models/test.model';
import { CheckBoxComponent } from 'src/app/shared/components/checkbox/checkbox.component';
import { ModalService } from 'src/app/shared/services/modal.service';
import { QuizService } from '../../services/quiz.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements OnInit, OnDestroy {
  testForm: FormGroup;
  showModal: boolean = false;
  testQuizzes: IQuiz[] = [];
  quizActions: unknown[] = [
    { actionName: 'select', componentName: CheckBoxComponent },
  ];
  tests: ITest[] = [];
  headers: string[] = ['Name', 'Category', 'Action'];
  quizHeaders: string[] = ['Name', 'Category','Sub Category','Action'];
  categories: string[] = ['JAVA', 'DOTNET', 'PHP'];
  _subscriptions: Subscription[] = [];
  constructor(
    private _formBuilder: FormBuilder,
    private modalService: ModalService,
    private quizService: QuizService
  ) {
    this.testForm = this._formBuilder.group({
      name: this._formBuilder.control('', [Validators.required]),
      categories: this._formBuilder.control('',Validators.required),
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
        .pipe(
          switchMap((quizzes: IQuiz[]) => {
            if (quizzes && quizzes.length > 0) {
              this.testQuizzes = quizzes;
              this.modalService.updateData(this.testQuizzes);
            }
            return this.quizService.getAvailableTests();
          })
        )
        .subscribe((res: ITest[]) => {
          this.tests = res;
        })
    );
  }
  onAddTest() {
    this.showModal = !this.showModal;
    this.modalService.openModal({ id: 'testModal', isShown: this.showModal });
  }
  createTest(form: FormGroup) {
    const newTest = {
      testCategoryId : '1', // form.get('categories').value array of categories
      comment: form.get('name')?.value
    } as ITest
    this.quizService.addTest(newTest).subscribe((response)=>{
      this.tests = [...this.tests,response]
      this.modalService.closeModal({ id: 'testModal', isShown: this.showModal })
    });
  }
  selectQuizzes() {
    this.modalService.openModal({ id: 'quizModal', isShown: true });
  }
  onReceivedData(event: any) {}

  onChecked(event: Event) {}
}
