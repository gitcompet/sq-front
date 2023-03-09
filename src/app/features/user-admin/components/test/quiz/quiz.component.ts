import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent {
  quizForm: FormGroup;
  showModal: boolean = false;
  constructor(
    private _formBuilder: FormBuilder,
    private modalService: ModalService
  ) {
    this.quizForm = this._formBuilder.group({
      questions: this._formBuilder.array([]),
    });
  }
  onAddQuiz() {
    this.showModal = !this.showModal;
    this.modalService.openModal('quizModal');
  }
  onCloseModal(value: boolean) {
    this.quizForm.reset({ questions: this._formBuilder.array([]) });
    console.log(this.quizForm);

    this.showModal = value;
  }
  createQuiz() {}
  createQuestion(): FormGroup {
    return this._formBuilder.group({
      question: ['', Validators.required],
      answer: [null, Validators.required],
      options: this._formBuilder.array([]),
    });
  }
  addQuestion() {
    this.questions.push(this.createQuestion());
  }
  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }
  createOption(): FormControl {
    return this._formBuilder.control('', Validators.required);
  }
  addOption(index: number) {
    this.options(index).push(this.createOption());
  }
  get options() {
    return (index: number) => {
      return this.questions.at(index).get('options') as FormArray;
    };
  }

  get questions() {
    return this.quizForm.get('questions') as FormArray;
  }
}
