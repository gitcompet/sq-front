import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { QuizModule } from './modules/quiz/quiz.module';
import { RouterModule } from '@angular/router';
import { UserDashboardRoutingModule } from './user-dashboard-routing.module';



@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    QuizModule,
    UserDashboardRoutingModule,
  ],
  exports: [HomeComponent]
})
export class UserDashboardModule { }
