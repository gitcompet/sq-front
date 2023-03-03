import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestComponent } from './components/test/test.component';
import { QuizRoutingModule } from './quiz-routing.module';



@NgModule({
  declarations: [
    TestComponent
  ],
  imports: [
    CommonModule,
    QuizRoutingModule
  ],
  exports: [TestComponent]
})
export class QuizModule { }
