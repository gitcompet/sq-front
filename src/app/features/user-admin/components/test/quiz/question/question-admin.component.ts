import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IDomain } from 'src/app/core/models/domain.model';
import { IQuestionResponse } from 'src/app/core/models/question-response.model';
import { QuizService } from 'src/app/features/user-admin/services/quiz.service';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
  selector: 'app-question-admin',
  templateUrl: './question-admin.component.html',
  styleUrls: ['./question-admin.component.css'],
})
export class QuestionAdminComponent implements OnInit, OnDestroy {
  questions: IQuestionResponse[] = [];

  questionForm: FormGroup;
  showModal: boolean = false;
  categories: IDomain[] = [];
  _subscriptions: Subscription[] = [];

  constructor(
    private quizService: QuizService,
    private _formBuilder: FormBuilder,
    private modalService: ModalService
  ) {
    this.questionForm = this._formBuilder.group({
      title: this._formBuilder.control(''),
      label: this._formBuilder.control('', [Validators.required]),
      description: this._formBuilder.control(''),
      role: this._formBuilder.control('', [Validators.required]),
      weight: this._formBuilder.control(0, [Validators.required]),
      duration: this._formBuilder.control(0, [Validators.required]),
      categories: this._formBuilder.control('', [Validators.required]),
    });
  }
  ngOnInit(): void {
    this._subscriptions.push(this.quizService
      .getAvailableQuestions()
      .subscribe((questions: IQuestionResponse[]) => {
        this.questions = questions;
      }));
  }
  onAddQuestion() {
    this.showModal = !this.showModal;
    this.quizService.getCategories().subscribe((res)=>this.categories = res);
    this.modalService.openModal({
      id: 'questionModal',
      isShown: this.showModal,
    });
  }
  createQuestion(form: FormGroup) {
     this._subscriptions.push(
      this.quizService.addQuestion(form.value).subscribe((res) => {
        this.questions = [...this.questions,res];
        this.modalService.closeModal({
          id: 'questionModal',
          isShown: this.showModal,
        });
      })
    );
  }
  ngOnDestroy(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
