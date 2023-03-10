import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Question } from 'src/app/core/models/question.model';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnInit, OnDestroy {
  quizForm: FormGroup;
  showModal: boolean = false;
  quizQuestions: Question[] = [];
  categories: string[] = ['JAVA','DOTNET','PHP'];
  _subscriptions: Subscription[] = [];
  headers: string[] = ['Title', 'Domain', 'Subdomain', 'Action'];
  constructor(
    private _formBuilder: FormBuilder,
    private modalService: ModalService
  ) {
    this.quizForm = this._formBuilder.group({
      title: this._formBuilder.control(''),
      description: this._formBuilder.control(''),
      role:this._formBuilder.control(''),
      categories: this._formBuilder.control(''),
      questions: this._formBuilder.array([]),
    });
  }
  ngOnInit(): void {
    this._subscriptions.push(
      this.modalService.getDataExchange().subscribe((result: any) => {
        if (result) {
          this.quizQuestions = result.data as Question[];
          console.log(this.quizQuestions);
        }
      })
    );
  }
  ngOnDestroy(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }
  onAddQuiz() {
    this.showModal = !this.showModal;
    this.modalService.openModal({ id: 'quizModal', isShown: this.showModal });
  }
  onCloseQuiz() {
    this.quizForm.reset({ questions: this._formBuilder.array([]) });
  }
  createQuiz() {
    console.log(this.quizForm);

  }
  onReceivedData(data: any){
  }
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
  selectQuestions() {
    this.modalService.openModal({ id: 'questionsModal', isShown: true });
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
