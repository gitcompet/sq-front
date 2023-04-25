import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilesComponent } from './components/profiles/profiles.component';
import { ProfileComponent } from './components/profiles/profile/profile.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { MainContentComponent } from './components/home/main-content/main-content.component';
import { QuizAdminComponent } from './components/test/quiz/quiz-admin.component';
import { TestsAdminComponent } from './components/test/tests-admin.component';
import { QuizComponent } from '../user-dashboard/components/tests/test/quizzes/quiz/quiz.component';
import { QuestionAdminComponent } from './components/test/quiz/question/question-admin.component';
import { LanguageComponent } from './components/languages/language/language.component';
import { LanguagesComponent } from './components/languages/languages.component';
import { SettingsPageComponent } from 'src/app/shared/components/settings-page/settings-page.component';

const routes: Routes = [
  {
    path: 'admin',
    component: HomeComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'settings',
        component: SettingsPageComponent,
        data: {
          roles: ['ADMIN'],
        },
      },
      {
        path: 'dashboard',
        component: MainContentComponent,
        data: {
          roles: ['ADMIN'],
        },
      },
      {
        path: 'profiles',
        component: ProfilesComponent,
        canActivateChild: [AuthGuard],
        children: [
          {
            path: ':id',
            component: ProfileComponent,
            data: {
              roles: ['ADMIN'],
            },
          },
        ],
        data: {
          roles: ['ADMIN'],
        },
      },
      {
        path: 'tests',
        component: TestsAdminComponent,
        data: {
          roles: ['ADMIN'],
        },
      },
      {
        path: 'quizzes',
        component: QuizAdminComponent,
        canActivateChild :[AuthGuard],
        children: [
          {
            path: ':id',
            component: QuizComponent,
            data: {
              roles: ['ADMIN'],
            },
          }
        ],
        data: {
          roles: ['ADMIN'],
        },
      },
      {
        path: 'questions',
        component: QuestionAdminComponent,
        canActivateChild :[AuthGuard],
        children: [],
        data: {
          roles: ['ADMIN'],
        },
      },
      {
        path: 'languages',
        component: LanguagesComponent,
        canActivateChild: [AuthGuard],
        children: [
          {
            path: ':id',
            component: LanguageComponent,
            data: {
              roles: ['ADMIN'],
            },
          },
        ],
        data: {
          roles: ['ADMIN'],
        },
      },
    ],
    data: {
      roles: ['ADMIN'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class UserAdminRoutingModule {}
