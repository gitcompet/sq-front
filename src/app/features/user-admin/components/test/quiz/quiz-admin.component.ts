import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  finalize,
  forkJoin,
  map,
  Observable,
  of,
  Subscription,
  switchMap,
} from 'rxjs';
import { IDomain } from 'src/app/core/models/domain.model';
import { IQuestionResponse } from 'src/app/core/models/question-response.model';
import { IQuestion } from 'src/app/core/models/question.model';
import { IQuizResponse } from 'src/app/core/models/quiz-response.model';
import { IQuiz } from 'src/app/core/models/quiz.model';
import { CheckBoxComponent } from 'src/app/shared/components/checkbox/checkbox.component';
import { ModalService } from 'src/app/shared/services/modal.service';
import { QuizService } from '../../../services/quiz.service';
import { Patch, OperationType } from 'src/app/core/models/patch.model';
import { ITestQuiz } from 'src/app/core/models/test-quiz-assign.model';
import { IQuizQuestion } from 'src/app/core/models/quiz-question-assign.model copy';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz-admin.component.html',
  styleUrls: ['./quiz-admin.component.css'],
})
export class QuizAdminComponent implements OnInit, OnDestroy {
  quizForm: FormGroup;
  updateQuizForm: FormGroup;
  data!: IQuizResponse;
  showModal: boolean = false;
  quizzes: IQuizResponse[] = [];
  questionsIds: string[] = [];

  quizQuestions: IQuestionResponse[] = [];
  headers: string[] = [
    'Id',
    'Label',
    'Title',
    'Description',
    'Level',
    'Duration (mn)',
    'Domain',
    'Action',
  ];
  questionActions: unknown[] = [
    { actionName: 'select', componentName: CheckBoxComponent },
  ];
  categories: Observable<IDomain[]> = new Observable();
  _subscriptions: Subscription[] = [];
  assignedCategories: IDomain[] = [];
  constructor(
    private _formBuilder: FormBuilder,
    private modalService: ModalService,
    private quizService: QuizService
  ) {
    this.quizForm = this._formBuilder.group({
      title: this._formBuilder.control('', [Validators.required]),
      comment: this._formBuilder.control('', [Validators.required]),
      label: this._formBuilder.control('', [Validators.required]),
      role: this._formBuilder.control('', [Validators.required]),
      weight: this._formBuilder.control(0, [Validators.required]),
      categories: this._formBuilder.control('', [Validators.required]),
      questions: this._formBuilder.array([]),
    });
    this.updateQuizForm = this._formBuilder.group({
      title: this._formBuilder.control(''),
      comment: this._formBuilder.control(''),
      label: this._formBuilder.control(''),
      role: this._formBuilder.control(''),
      weight: this._formBuilder.control(0),
      categories: this._formBuilder.control(''),
      questions: this._formBuilder.array([]),
    });
  }
  ngOnInit(): void {
    this._subscriptions.push(
      this.modalService.getDataExchange().subscribe((data: any) => {
        if (data && Object.hasOwn(data, 'quizId')) {
          this.data = data;
          this.updateQuizForm.patchValue(data);
          this.updateQuizForm.updateValueAndValidity();
          this.assignedCategories = this.data.domains;
          this.categories = this.quizService.getCategories().pipe(
            map((value, index) => {
              return value.filter(
                (category) =>
                  this.data.domains.find(
                    (vl) => vl.domainId === category.domainId
                  ) === undefined
              );
            })
          );
        }
      })
    );
    this._subscriptions.push(
      this.quizService
        .getAvailableQuizzes()
        .subscribe((quizzes: IQuizResponse[]) => {
          if (quizzes && quizzes.length > 0) {
            this.quizzes = quizzes;
          }
        })
    );
  }

  onAddQuiz() {
    this.showModal = !this.showModal;
    this.modalService.openModal({ id: 'quizModal', isShown: this.showModal });
  }
  onCloseQuiz() {
    this.quizForm.reset({ questions: this._formBuilder.array([]) });
  }
  onChecked(event: any) {
    if (event.target.checked) {
      this.questionsIds.push(event.target.defaultValue);
    }
  }
  createQuiz(form: FormGroup) {
    const newQuiz = {
      title: form.get('title')?.value,
      subDomainId: form.get('role')?.value,
      domainId: form.get('categories')?.value,
      weight: form.get('weight')?.value,
      comment: form.get('description')?.value,
      label: form.get('label')?.value,
    } as IQuiz;

    this.quizService
      .addQuiz(newQuiz)
      .pipe(
        switchMap((newQuiz: IQuizResponse) => {
          this.quizzes = [...this.quizzes, newQuiz];
          return this.questionsIds.length > 0
            ? forkJoin(
                this.questionsIds.map((questionId) =>
                  this.quizService.assignQuesion({
                    quizId: newQuiz.quizId,
                    questionId: questionId,
                  } as IQuizQuestion)
                )
              )
            : of();
        })
      )
      .subscribe((response) => {
        this.modalService.closeModal({
          id: 'quizModal',
          isShown: this.showModal,
        });
      });
  }
  updateQuiz(form: FormGroup) {
    if (!form.valid) return;
    const controls = form.controls;
    const patches: Patch[] = Object.entries(controls)
      .map((entry) => {
        if (entry[1].value && (!entry[1].pristine || entry[1].dirty)) {
          return {
            path: `/${entry[0]}`,
            op: OperationType.REPLACE,
            value: entry[1].value,
          };
        }
        return undefined as unknown as Patch;
      })
      .filter(
        (patch) => patch !== undefined && !patch.path.includes('categories')
      );

    const categoryPathes = Object.entries(controls)
      .filter((entry) => entry[0].includes('categories'))
      .flatMap((entry) => {
        if (entry[1].value && (!entry[1].pristine || entry[1].dirty)) {
          return entry[1].value.map(
            (value: string) =>
              ({
                path: `/domainId`,
                op: OperationType.REPLACE,
                value: value,
              } as Patch)
          );
        }
        return undefined as unknown as Patch;
      })
      .filter((patch) => patch !== undefined);

    if (patches.length > 0 && this.data) {
      this._subscriptions.push(
        this.quizService
          .updateQuiz(this.data.quizId as string, patches)
          .pipe(
            switchMap((newQuiz: IQuizResponse) => {
              this.data = { ...newQuiz };
              this.modalService.updateData(this.data);
              return forkJoin(
                this.questionsIds.map((questionId) =>
                  this.quizService.assignQuesion({
                    quizId: newQuiz.quizId,
                    questionId: questionId,
                  } as IQuizQuestion)
                )
              );
            }),
            finalize(() =>
              this.modalService.closeModal({
                id: 'updateQuizModal',
                isShown: this.showModal,
              })
            )
          )
          .subscribe()
      );
    }

    if (categoryPathes.length > 0 && this.data) {
      const result =
        this.data.quizDomainComposeId.length > 0
          ? this.data.quizDomainComposeId
              .filter((value, index) => {
                return categoryPathes[index];
              })
              .map((value, index) => {
                return this.quizService.updateQuizDomains(value, [
                  categoryPathes[index],
                ]);
              })
          : categoryPathes.map((patch) =>
              this.quizService.addQuizDomains({
                quizId: this.data.quizId,
                quizCategoryId: patch.value,
              })
            );
      this._subscriptions.push(
        forkJoin(result)
          .pipe(
            switchMap(() => this.quizService.getQuiz(this.data)),
            finalize(() => {
              this.modalService.closeModal({
                id: 'updateQuizModal',
                isShown: this.showModal,
              });
            })
          )
          .subscribe((res) => {
            this.data = { ...res };
            this.modalService.updateData(this.data);
          })
      );
    }
  }
  deleteQuiz() {
    if (this.data) {
      this.quizService
        .deleteQuiz(this.data.quizId)
        .pipe(
          finalize(() =>
            this.modalService.closeModal({
              id: 'confirmationModal',
              isShown: false,
            })
          )
        )
        .subscribe((res: any) => {
          this.quizzes = [
            ...this.quizzes.filter((quiz) => res.quizId !== quiz.quizId),
          ];
        });
    }
  }
  assignQuestions() {
    this.modalService.closeModal({
      id: 'questionsModal',
      isShown: this.showModal,
    });
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
    this.quizService.getAvailableQuestions().subscribe((questions) => {
      if (questions && questions.length > 0) {
        this.quizQuestions = questions;
        this.modalService.updateData(this.quizQuestions);
        this.modalService.openModal({ id: 'questionsModal', isShown: true });
      }
    });
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
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
