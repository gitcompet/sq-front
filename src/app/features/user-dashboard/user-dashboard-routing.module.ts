import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { UserHomeComponent } from './components/home/user-home.component';
import { QuizzesComponent } from './components/tests/quizzes/quizzes.component';
import { TestsComponent } from './components/tests/tests.component';

const routes: Routes = [
  {
    path: 'home',
    component: UserHomeComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'tests',
        component: TestsComponent,
        canActivateChild: [AuthGuard],
        children: [
          {
            path: ':id',
            component: QuizzesComponent,
            data: {
              roles: ['USER'],
            },
          },
        ],
        data: {
          roles: ['USER'],
        },
      },
    ],
    data: {
      roles: ['USER'],
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserDashboardRoutingModule {}
