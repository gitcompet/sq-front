import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, switchMap, tap } from 'rxjs';
import { Language } from 'src/app/core/models/language.model';
import { OperationType, Patch } from 'src/app/core/models/patch.model';
import { LanguageService } from 'src/app/features/user-admin/services/lngMgmt.service';
import { UserService } from 'src/app/features/user-profile/services/user.service';
import { AuthService } from '../../services/auth.service';
import { LanguageManagerService } from '../../services/language-manager.service';
import { TokenResponse } from 'src/app/core/models/token-response.model';

@Component({
  selector: 'app-navbar-settings',
  templateUrl: './navbar-settings.component.html',
  styleUrls: ['./navbar-settings.component.css'],
})
export class NavbarSettingsComponent implements OnInit, OnDestroy {
  @Input() data: any;
  isOpen: boolean = false;
  languages: Observable<Language[]>;
  langId: string = '';
  currentLang: Language = {} as Language;
  _subscriptions: Subscription[] = [];
  languageForm: FormGroup;

  constructor(
    private authService: AuthService,
    private languageManagerService: LanguageManagerService,
    private languagesService: LanguageService,
    private userService: UserService,
    private _formBuilder: FormBuilder
  ) {
    this.languages = new Observable<Language[]>();
    this.langId = this.languageManagerService.getCurrentLanguageId();
    this.languageForm = this._formBuilder.group({
      language: this._formBuilder.control('', [Validators.required]),
    });
  }
  ngOnInit() {
    this.languages = this.languagesService.getLanguage(this.langId).pipe(
      switchMap((res) => {
        return this.languagesService.getLanguages();
      }),
      tap((res)=>this.currentLang = res.find((lang)=>lang.languageId === this.langId)!)
    );
  }
  onLanguageChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    const languageId: string = target.value;
    this.userService
      .patchUser(this.authService.getId(), [
        {
          op: OperationType.REPLACE,
          path: '/languageId',
          value: languageId,
        } as unknown as Patch,
      ])
      .pipe(
        switchMap((res) => {
          return this.authService.refreshToken({
            refreshToken: this.authService.getRefreshToken(),
            accessToken: this.authService.getToken(),
          });
        })
      )
      .subscribe((newToken: TokenResponse) => {
        console.log(newToken);

        this.authService.removeToken();
        this.authService.setToken(newToken);
      });
  }
  toggleProfileMenu() {
    this.isOpen = !this.isOpen;
  }
  onLogout() {
    this.authService.logout();
  }
  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }
}
