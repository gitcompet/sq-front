import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { ContactComponent } from './components/contact/contact.component';
import { UserHomeComponent } from './components/home/user-home.component';
import { QuizzesComponent } from './components/tests/test/quizzes/quizzes.component';
import { TestComponent } from './components/tests/test/test.component';
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
            component: TestComponent,
            data: {
              roles: ['USER'],
            },
          },
        ],
        data: {
          roles: ['USER'],
        },
      },
      {
        path:'contact',
        component: ContactComponent,
        data: {
          roles: ['USER'],
        },
      }
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
