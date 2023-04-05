import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { SharedModule } from "../../shared/shared.module";
import { UserHomeComponent } from './components/home/user-home.component';
import { QuizzesComponent } from './components/tests/test/quizzes/quizzes.component';
import { TestsComponent } from './components/tests/tests.component';
import { TestComponent } from './components/tests/test/test.component';
import { QuizComponent } from './components/tests/test/quizzes/quiz/quiz.component';
import { QuestionComponent } from './components/tests/test/quizzes/quiz/question/question.component';
import { ContactComponent } from './components/contact/contact.component';
import { TakeQuizComponent } from './components/tests/test/quizzes/take-quiz/take-quiz.component';
import { QuizScoreComponent } from './components/tests/test/quizzes/quiz-score/quiz-score.component';
import { QuizSummaryComponent } from './components/tests/test/quizzes/quiz-summary/quiz-summary.component';



@NgModule({
    declarations: [UserHomeComponent, TestsComponent, QuizzesComponent, TestComponent, QuizComponent,QuestionComponent, ContactComponent, TakeQuizComponent, QuizScoreComponent, QuizSummaryComponent],
    exports: [UserHomeComponent,TestsComponent,QuizzesComponent,TestComponent,QuestionComponent,ContactComponent,TakeQuizComponent,QuizScoreComponent],
    imports: [
        CommonModule,
        UserDashboardRoutingModule,
        SharedModule
    ]
})
export class UserDashboardModule { }
