import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { TakeQuizComponent } from './features/user-dashboard/components/tests/test/quizzes/take-quiz/take-quiz.component';
import { QuizScoreComponent } from './features/user-dashboard/components/tests/test/quizzes/quiz-score/quiz-score.component';
import { QuizSummaryComponent } from './features/user-dashboard/components/tests/test/quizzes/quiz-summary/quiz-summary.component';
import { QuizIntroductionComponent } from './features/user-dashboard/components/tests/test/quizzes/quiz-introduction/quiz-introduction.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'quiz/:id',
    canActivate: [AuthGuard],
    component: QuizIntroductionComponent,
    data: {
      roles: ['USER'],
    },
  },
  {
    path: 'quiz/:id/on',
    component: TakeQuizComponent,
    canActivateChild: [AuthGuard] ,
    children: [
      {
        path: ":questionId",
        component: TakeQuizComponent,
        data: {
          roles: ['USER'],
        },
      }
    ],
    data: {
      roles: ['USER'],
    },

  },
  {
    path: 'summary',
    canActivate:[AuthGuard],
    component: QuizSummaryComponent,
    data: {
      roles: ['USER'],
    },
  },
  {
    path: 'score',
    component: QuizScoreComponent,
    data: {
      roles: ['USER'],
    },
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 64],
      preloadingStrategy: PreloadAllModules
    }),
    CommonModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
