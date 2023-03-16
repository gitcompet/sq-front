import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilesComponent } from './components/profiles/profiles.component';
import { ProfileComponent } from './components/profiles/profile/profile.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { MainContentComponent } from './components/home/main-content/main-content.component';
import { TestComponent } from './components/test/test.component';
import { QuizComponent } from './components/test/quiz/quiz.component';
import { LanguageComponent } from './components/languages/language/language.component';
import { LanguagesComponent } from './components/languages/languages.component';

const routes: Routes = [
  {
    path: 'admin',
    component: HomeComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: MainContentComponent,
      },
      {
        path: 'profiles',
        component: ProfilesComponent,
        canActivateChild: [AuthGuard],
        children: [{ path: ':id', component: ProfileComponent }],
      },
      {
        path: 'tests',
        component: TestComponent,
      },
      {
        path: 'quizzes',
        component: QuizComponent,
      },
      {
        path: 'languages',
        component: LanguagesComponent,
        canActivateChild: [AuthGuard],
        children: [{
          path: ':id',
          component: LanguageComponent
        }]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class UserAdminRoutingModule {}
