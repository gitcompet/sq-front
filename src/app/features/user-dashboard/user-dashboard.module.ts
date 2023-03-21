import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizModule } from './modules/quiz/quiz.module';
import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { SharedModule } from "../../shared/shared.module";
import { UserHomeComponent } from './components/home/user-home.component';
import { TestsComponent } from './components/tests/tests.component';
import { QuizzesComponent } from './components/tests/quizzes/quizzes.component';



@NgModule({
    declarations: [UserHomeComponent, TestsComponent, QuizzesComponent],
    exports: [UserHomeComponent,TestsComponent,QuizzesComponent],
    imports: [
        CommonModule,
        QuizModule,
        UserDashboardRoutingModule,
        SharedModule
    ]
})
export class UserDashboardModule { }
