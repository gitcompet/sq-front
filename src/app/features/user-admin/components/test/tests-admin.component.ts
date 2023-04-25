import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  filter,
  finalize,
  forkJoin,
  map,
  Observable,
  of,
  shareReplay,
  Subscription,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { IDomain } from 'src/app/core/models/domain.model';
import { OperationType, Patch } from 'src/app/core/models/patch.model';
import { IQuizResponse } from 'src/app/core/models/quiz-response.model';
import { ITestQuiz } from 'src/app/core/models/test-quiz-assign.model';
import { ITestResponse } from 'src/app/core/models/test-response.model';
import { ITest } from 'src/app/core/models/test.model';
import { ModalService } from 'src/app/shared/services/modal.service';
import { QuizService } from '../../services/quiz.service';

@Component({
  selector: 'app-admin-tests',
  templateUrl: './tests-admin.component.html',
  styleUrls: ['./tests-admin.component.css'],
})
export class TestsAdminComponent implements OnInit, OnDestroy {
  testForm: FormGroup;
  testUpdateForm: FormGroup;
  showModal: boolean = false;
  testQuizzes: IQuizResponse[] = [];
  data!: ITestResponse;
  quizzesIds: string[] = [];
  tests: ITestResponse[] = [];
  headers: string[] = ['Id', 'Title', 'Description', 'Domain', 'Action'];
  categories: Observable<IDomain[]> = new Observable();
  assignedCategories: IDomain[] = [];
  private unAssignedCategories: IDomain[] = [];
  categoryIds: string[] = [];
  _subscriptions: Subscription[] = [];
  newTest: ITest = {} as ITest;
  constructor(
    private _formBuilder: FormBuilder,
    private modalService: ModalService,
    private quizService: QuizService
  ) {
    this.testForm = this._formBuilder.group({
      title: this._formBuilder.control('', [Validators.required]),
      label: this._formBuilder.control('', [Validators.required]),
      categories: this._formBuilder.control('', Validators.required),
    });
    this.testUpdateForm = this._formBuilder.group({
      title: this._formBuilder.control(''),
      label: this._formBuilder.control(''),
      categories: this._formBuilder.control(''),
      assignedCategories: this._formBuilder.control(''),
    });
  }

  ngOnInit(): void {
    this._subscriptions.push(
      this.modalService.getDataExchange().subscribe((data: any) => {
        if (data && Object.hasOwn(data, 'testId')) {
          this.data = data;
          this.testUpdateForm.patchValue(data);
          this.testUpdateForm.updateValueAndValidity();
          this.assignedCategories = this.data.categories;

          this.categories = this.quizService.getCategories().pipe(
            map((value, index) => {
              return value.filter(
                (category) =>
                  this.data.categories.find(
                    (vl) => vl.domainId === category.domainId
                  ) === undefined
              );
            })
          );
        }
      })
    );
    this.categories = this.quizService.getCategories();
  }
  onAddTest() {
    this.showModal = !this.showModal;
    this.modalService.openModal({ id: 'testModal', isShown: this.showModal });
  }
  createTest(form: FormGroup) {
    this.newTest = {
      ...this.newTest,
      testCategoryId: form.get('categories')?.value, // form.get('categories').value array of categories
      title: form.get('title')?.value,
      comment: '',
      label: form.get('label')?.value,
    } as ITest;
    this._subscriptions.push(
      this.quizService
        .addTest(this.newTest)
        .pipe(
          switchMap((newTest: ITestResponse) => {
            this.tests.push(newTest);
            return this.quizzesIds.length > 0
              ? forkJoin(
                  this.quizzesIds.map((quizId) =>
                    this.quizService.assignQuiz({
                      quizId: quizId,
                      testId: newTest.testId,
                    } as ITestQuiz)
                  )
                )
              : of();
          }),
          switchMap((compositions: ITestQuiz[]) => {
            const filtredComposition = compositions
              .map((testQuiz) => testQuiz.quizId)
              .filter((item, pos, self) => self.indexOf(item) == pos);
            const observables = [
              of(compositions),
              forkJoin(
                filtredComposition.map((quizId) =>
                  this.quizService.getQuiz({ quizId } as IQuizResponse)
                )
              ),
            ];
            return forkJoin(observables);
          })
        )
        .subscribe({
          next: (mergedResults) => {
            const quizzes: IQuizResponse[] =
              mergedResults[1] as IQuizResponse[];
            this.tests = [
              ...this.tests,
              {
                ...this.tests.at(this.tests.length - 1),
                quizzes: quizzes,
              } as ITestResponse,
            ];
          },
          complete: () => {
            this.modalService.closeModal({
              id: 'testModal',
              isShown: this.showModal,
            });
          },
        })
    );
  }

  updateTest(form: FormGroup) {
    if (!form.valid) return;
    if (this.unAssignedCategories.length > 0) {
      forkJoin(
        this.data.categories
          .map((category) => category.domainComposeId)
          .filter((cat) =>
            this.unAssignedCategories.map((ct) => ct.domainId).includes(cat)
          )
          .map((id) => this.quizService.unAssignCategoriesTest(id))
      ).subscribe((removedCategories) => console.log(removedCategories));
      return;
    }

    const controls: any = form.controls;

    const {
      patches,
      categoryPathes,
    }: { patches: Patch[]; categoryPathes: Patch[] } =
      this.setUpPatches(controls);

    if (patches.length > 0 && this.data) {
      this._subscriptions.push(
        this.quizService
          .updateTest(this.data.testId as string, patches)
          .pipe(
            switchMap((newTest: ITestResponse) => {
              this.data = { ...newTest };
              this.modalService.updateData(this.data);
              const obs = [
                forkJoin(
                  this.quizzesIds.map((quizId) =>
                    this.quizService.assignQuiz({
                      quizId: quizId,
                      testId: newTest.testId,
                    } as ITestQuiz)
                  )
                ),
                of(newTest),
              ];
              return forkJoin(obs);
            }),

            finalize(() =>
              this.modalService.closeModal({
                id: 'updateTestModal',
                isShown: this.showModal,
              })
            )
          )
          .subscribe()
      );
    }

    if (categoryPathes.length > 0 && this.data) {
      const result =
        this.data.testCategoryComposeId.length > 0 &&
        this.data.categories
          .map((cat) => cat.domainId)
          .every((val, index) => categoryPathes[index].value === val)
          ? this.data.testCategoryComposeId
              .filter((value, index) => {
                return categoryPathes[index];
              })
              .map((value, index) => {
                return this.quizService.updateCategories(value, [
                  categoryPathes[index],
                ]);
              })
          : categoryPathes.map((patch) =>
              this.quizService.addCategories({
                testId: this.data.testId,
                testCategoryId: patch.value,
              })
            );
      this._subscriptions.push(
        forkJoin(result)
          .pipe(
            finalize(() => {
              this.modalService.closeModal({
                id: 'updateTestModal',
                isShown: this.showModal,
              });
            })
          )
          .subscribe((res: any) => {
            this.data = { ...res };
            this.modalService.updateData(this.data);
          })
      );
    }
  }
  private setUpPatches(controls: AbstractControl<any>) {
    this.testUpdateForm.get('categories')?.patchValue(this.categoryIds);
    this.testUpdateForm.updateValueAndValidity();
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
                path: `/testCategoryId`,
                op: OperationType.REPLACE,
                value: value,
              } as Patch)
          );
        }
        return undefined as unknown as Patch;
      })
      .filter((patch) => patch !== undefined);
    return { patches, categoryPathes };
  }

  unAssign() {
    const assigned = this.testUpdateForm.get('assignedCategories');
    const available = this.testUpdateForm.get('categories');
    if (assigned && available) {
      const categoryToRemove = this.assignedCategories.filter((category) =>
        assigned.value.find((ct: string) => category.domainId === ct)
      );
      this.unAssignedCategories = assigned.value.filter(
        (cat: string) =>
          !categoryToRemove.map((category) => category.domainId).includes(cat)
      );
      available.patchValue(this.unAssignedCategories);
      this.categoryIds = [
        ...this.categoryIds,
        ...categoryToRemove.map((domain) => domain.domainId),
      ].filter((item, pos, self) => self.indexOf(item) == pos);
      this.testUpdateForm.updateValueAndValidity();
      this.categories = this.categories.pipe(
        map((categories) => [...categories, ...categoryToRemove]),
        tap(
          () =>
            (this.assignedCategories = this.assignedCategories.filter(
              (category) =>
                !assigned.value.find((ct: string) => category.domainId === ct)
            ))
        )
      );
    }
  }
  assign() {
    const available = this.testUpdateForm.get('categories');
    if (available) {
      this.categories = this.categories.pipe(
        map((categories) => {
          const categoryToRemove = categories.filter((category) =>
            available.value.find((ct: string) => category.domainId === ct)
          );
          this.assignedCategories = [
            ...this.assignedCategories,
            ...categoryToRemove,
          ];
          available.patchValue(
            categoryToRemove.map((category) => category.domainId)
          );
          this.categoryIds.push(
            ...categoryToRemove.map((category) => category.domainId)
          );
          this.testUpdateForm.updateValueAndValidity();
          return categories.filter(
            (category) =>
              !available.value.find((ct: string) => category.domainId === ct)
          );
        }),
        shareReplay()
      );
    }
  }
  deleteTest() {
    if (this.data) {
      this._subscriptions.push(
        this.quizService
          .deleteTest(this.data.testId as string)
          .pipe(
            finalize(() =>
              this.modalService.closeModal({
                id: 'confirmationModal',
                isShown: false,
              })
            )
          )
          .subscribe((res) => {
            this.tests = this.tests.filter(
              (test) => test.testId !== res.testId
            );
          })
      );
    }
  }
  selectQuizzes() {
    this._subscriptions.push(
      this.quizService
        .getAvailableQuizzes()
        .subscribe((quizzes: IQuizResponse[]) => {
          if (quizzes && quizzes.length > 0) {
            this.testQuizzes = quizzes.map(
              (quiz: IQuizResponse) =>
                ({
                  quizId: quiz.quizId,
                  title: quiz.title,
                  comment: quiz.comment,
                  domains: quiz.domains,
                } as IQuizResponse)
            );
            this.modalService.updateData(this.testQuizzes);
            this.modalService.openModal({ id: 'quizModal', isShown: true });
          }
        })
    );
  }
  assignQuizzes() {
    this.modalService.closeModal({ id: 'quizModal', isShown: this.showModal });
  }

  onChecked(event: any) {
    if (event.target.checked) {
      this.quizzesIds.push(event.target.defaultValue);
    }
  }
  ngOnDestroy(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
