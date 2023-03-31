import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { forkJoin, Observable, of, Subscription, switchMap } from 'rxjs';
import { IDomain } from 'src/app/core/models/domain.model';
import { IQuestionResponse } from 'src/app/core/models/question-response.model';
import { IQuestion } from 'src/app/core/models/question.model';
import { IQuizResponse } from 'src/app/core/models/quiz-response.model';
import { IQuiz } from 'src/app/core/models/quiz.model';
import { CheckBoxComponent } from 'src/app/shared/components/checkbox/checkbox.component';
import { ModalService } from 'src/app/shared/services/modal.service';
import { QuizService } from '../../../services/quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz-admin.component.html',
  styleUrls: ['./quiz-admin.component.css'],
})
export class QuizAdminComponent implements OnInit, OnDestroy {
  quizForm: FormGroup;
  showModal: boolean = false;
  quizzes: IQuizResponse[] = [];
  questionsIds: string[] = [];

  quizQuestions: IQuestionResponse[] = [];
  headers: string[] = ['Title', 'Domain', 'Subdomain', 'Action'];
  questionActions: unknown[] = [
    { actionName: 'select', componentName: CheckBoxComponent },
  ];
  categories: IDomain[] = [];
  _subscriptions: Subscription[] = [];
  constructor(
    private _formBuilder: FormBuilder,
    private modalService: ModalService,
    private quizService: QuizService
  ) {
    this.quizForm = this._formBuilder.group({
      title: this._formBuilder.control('', [Validators.required]),
      description: this._formBuilder.control('', [Validators.required]),
      role: this._formBuilder.control('', [Validators.required]),
      weight: this._formBuilder.control(0, [Validators.required]),
      categories: this._formBuilder.control('', [Validators.required]),
      questions: this._formBuilder.array([]),
    });
  }
  ngOnInit(): void {
    this._subscriptions.push(this.modalService.getDataExchange().subscribe());
    this._subscriptions.push(
      this.quizService
        .getAvailableQuestions()
        .pipe(
          switchMap((questions: IQuestionResponse[]) => {
            if (questions && questions.length > 0) {
              this.quizQuestions = questions;
              this.modalService.updateData(this.quizQuestions);
            }
            return this.quizService.getAvailableQuizzes();
          })
        )
        .subscribe((quizzes: IQuizResponse[]) => {
          if (quizzes && quizzes.length > 0) {
            this.quizzes = quizzes;
          }
        })
    );
  }
  ngOnDestroy(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }
  onAddQuiz() {
    this.quizService.getCategories().subscribe((res)=>this.categories = res);
    this.showModal = !this.showModal;
    this.modalService.openModal({ id: 'quizModal', isShown: this.showModal });
  }
  onCloseQuiz() {
    this.quizForm.reset({ questions: this._formBuilder.array([]) });
  }
  onChecked(event: any) {
    if (event.target.checked) {
      this.questionsIds.push(event.target.defaultValue);
    }}
  createQuiz(form: FormGroup) {
    const newQuiz = {
      title: form.get('title')?.value,
      subDomainId: ['1'],
      domainId: ['1'],
      weight: form.get('weight')?.value,
      comment: form.get('description')?.value,
    } as IQuiz;

    this.quizService.addQuiz(newQuiz) .pipe(
      switchMap((newQuiz: IQuizResponse) => {
        this.quizzes = [...this.quizzes, newQuiz];
        return this.questionsIds.length > 0 ?forkJoin(
          this.questionsIds.map((questionId) =>
            this.quizService.assignQuesion({
              quizId: newQuiz.quizId,
              questionId: questionId,
              questionLevel: 1,
              questionWeight: 1
            })
          )
        ): of();
      })
    )
    .subscribe((response) => {
      this.modalService.closeModal({
        id: 'quizModal',
        isShown: this.showModal,
      });
    });
  }
  assignQuestions() {
    this.modalService.closeModal({ id: 'questionsModal', isShown: this.showModal });
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
