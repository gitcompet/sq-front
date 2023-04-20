import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Observable,
  Subscription,
  count,
  map,
  reduce,
  switchMap,
  tap,
} from 'rxjs';
import { extractName } from 'src/app/core/constants/settings';
import { Language } from 'src/app/core/models/language.model';
import { OperationType, Patch } from 'src/app/core/models/patch.model';
import { IQuestionResponse } from 'src/app/core/models/question-response.model';
import { IQuizResponse } from 'src/app/core/models/quiz-response.model';
import { TokenResponse } from 'src/app/core/models/token-response.model';
import { LanguageService } from 'src/app/features/user-admin/services/lngMgmt.service';
import { QuizService } from 'src/app/features/user-admin/services/quiz.service';
import { UserService } from 'src/app/features/user-profile/services/user.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LanguageManagerService } from 'src/app/shared/services/language-manager.service';

@Component({
  selector: 'app-quiz-introduction',
  templateUrl: './quiz-introduction.component.html',
  styleUrls: ['./quiz-introduction.component.css'],
})
export class QuizIntroductionComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  quiz: IQuizResponse;
  languageForm: FormGroup;
  langId: string;
  languages: Observable<Language[]>;
  totalDuration: number = 0;
  _subscriptions: Subscription[] = [];
  extractName = extractName;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private quizService: QuizService,
    private languagesService: LanguageService,
    private languageManagerService: LanguageManagerService,
    private _formBuilder: FormBuilder
  ) {
    this.quiz = this.router.getCurrentNavigation()?.extras
      .state as IQuizResponse;

    this.languages = new Observable<Language[]>();
    this.langId = this.languageManagerService.getCurrentLanguageId();
    this.languageForm = this._formBuilder.group({
      language: this._formBuilder.control('', [Validators.required]),
    });
  }

  ngAfterViewInit(): void {

  }
  ngOnInit(): void {
    this._subscriptions.push(
      this.quizService
        .getUserQuestions(this.quiz.quizUserId!)
        .pipe()
        .subscribe((questions: any) => {
          this.totalDuration = questions['value']
            .map((question: any) => question.duration)
            .reduce((acc: number, current: number) => current + acc);
        })
    );
    this.languages = this.languagesService.getLanguage(this.langId).pipe(
      switchMap((res) => {
        return this.languagesService.getLanguages();
      }),
      tap((res) => {
        const found = res.find((lang) => lang.languageId === this.langId);
        this.languageForm.setValue({ language: found });
        this.languageForm.updateValueAndValidity();
      })
    );
  }
  startQuiz() {
    const selectedQuizUrl = this.router.createUrlTree(
      ['../..', 'quiz', this.quiz.quizId, 'on'],
      {
        relativeTo: this.route,
      }
    );
    this.router.navigateByUrl(selectedQuizUrl, { state: this.quiz });
  }
  onLanguageChange(event: Event) {
    const language = this.languageForm.get('language')?.value;
    this.quizService
      .updateUserQuiz(this.quiz.quizUserId!, [
        {
          op: OperationType.REPLACE,
          path: '/languageId',
          value: language.languageId,
        } as unknown as Patch,
      ])
      .subscribe((res) => {
        this.quiz = res;
      });
  }
  ngOnDestroy(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
