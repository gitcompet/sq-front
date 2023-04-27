import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription, finalize, forkJoin, map } from 'rxjs';
import { IDomain } from 'src/app/core/models/domain.model';
import { Patch, OperationType } from 'src/app/core/models/patch.model';
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
  data!: IQuestionResponse;
  questionForm: FormGroup;
  updateQuestionForm: FormGroup;
  showModal: boolean = false;
  categories: Observable<IDomain[]> = new Observable();
  _subscriptions: Subscription[] = [];
  assignedCategories: IDomain[] =[];

  constructor(
    private quizService: QuizService,
    private _formBuilder: FormBuilder,
    private modalService: ModalService
  ) {
    this.questionForm = this._formBuilder.group({
      title: this._formBuilder.control(''),
      label: this._formBuilder.control('', [Validators.required]),
      comment: this._formBuilder.control(''),
      role: this._formBuilder.control('', [Validators.required]),
      weight: this._formBuilder.control(0, [Validators.required]),
      duration: this._formBuilder.control(0, [Validators.required]),
      categories: this._formBuilder.control('', [Validators.required]),
    });
    this.updateQuestionForm = this._formBuilder.group({
      title: this._formBuilder.control(''),
      label: this._formBuilder.control(''),
      comment: this._formBuilder.control(''),
      role: this._formBuilder.control(''),
      weight: this._formBuilder.control(0),
      duration: this._formBuilder.control(0),
      categories: this._formBuilder.control(''),
    });
  }
  ngOnInit(): void {
    this._subscriptions.push(
      this.modalService.getDataExchange().subscribe((data: any) => {
        if (data && Object.hasOwn(data, 'questionId')) {
          this.data = data;
          this.updateQuestionForm.patchValue(data);
          this.updateQuestionForm.updateValueAndValidity();
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
        .getAvailableQuestions()
        .subscribe((questions: IQuestionResponse[]) => {
          this.questions = questions;
        })
    );
    this.categories = this.quizService.getCategories();
  }
  onAddQuestion() {
    this.showModal = !this.showModal;
    this.modalService.openModal({
      id: 'questionModal',
      isShown: this.showModal,
    });
  }
  createQuestion(form: FormGroup) {
    this._subscriptions.push(
      this.quizService.addQuestion(form.value).subscribe((res) => {
        this.questions = [...this.questions, res];
        this.modalService.closeModal({
          id: 'questionModal',
          isShown: this.showModal,
        });
      })
    );
  }
  updateQuestion(form: FormGroup) {
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
          .updateQuestion(this.data.questionId, patches)
          .subscribe((newQuestion) => {
            this.data = { ...newQuestion };
            this.modalService.updateData(this.data);
            this.modalService.closeModal({
              id: 'updateQuestionModal',
              isShown: this.showModal,
            });
          })
      );
    }

    if (categoryPathes.length > 0 && this.data) {
      const result =
        this.data.questionDomainComposeId.length > 0
          ? this.data.questionDomainComposeId
              .filter((value, index) => {
                return categoryPathes[index];
              })
              .map((value, index) => {
                return this.quizService.updateQuestionDomains(value, [
                  categoryPathes[index],
                ]);
              })
          : categoryPathes.map((patch) =>
              this.quizService.addQuestionDomains({
                questionId: this.data.questionId,
                questionCategoryId: patch.value,
              })
            );
      this._subscriptions.push(
        forkJoin(result).subscribe((res) => {
          this.modalService.updateData(this.data);
          this.modalService.closeModal({
            id: 'updateQuestionModal',
            isShown: this.showModal,
          });
        })
      );
    }
  }
  deleteQuestion() {
    if (this.data) {
      this.quizService
        .deleteQuestion(this.data.questionId)
        .pipe(
          finalize(() =>
            this.modalService.closeModal({
              id: 'confirmationModal',
              isShown: false,
            })
          )
        )
        .subscribe((res: any) => {
          this.questions = this.questions.filter(
            (question) => res.questionId !== question.questionId
          );
        });
    }
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
