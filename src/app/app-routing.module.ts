import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { TakeQuizComponent } from './features/user-dashboard/components/tests/test/quizzes/take-quiz/take-quiz.component';

const routes: Routes = [      {
  path: 'quiz/:id',
  component: TakeQuizComponent,
  data: {
    roles: ['USER'],
  },
},{ path: '**', component: PageNotFoundComponent }];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 64],
    }),
    CommonModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
