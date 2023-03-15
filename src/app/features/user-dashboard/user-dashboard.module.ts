import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { QuizModule } from './modules/quiz/quiz.module';
import { RouterModule } from '@angular/router';
import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { SharedModule } from "../../shared/shared.module";



@NgModule({
    declarations: [HomeComponent],
    exports: [HomeComponent],
    imports: [
        CommonModule,
        QuizModule,
        UserDashboardRoutingModule,
        SharedModule
    ]
})
export class UserDashboardModule { }
