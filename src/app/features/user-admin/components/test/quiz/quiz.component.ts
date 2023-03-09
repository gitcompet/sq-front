import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalService } from 'src/app/shared/services/modal.service';
import { QuestionComponent } from './question/question.component';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {
    quizForms: QuestionComponent [] = []
    quizForm: FormGroup ;
    showModal: boolean = false;
    constructor(private _formBuilder:FormBuilder, private modalService: ModalService){
      this.quizForm =  this._formBuilder.group({
        questions: this._formBuilder.array([])
      });
    }
    onAddQuiz(){
       this.showModal =  !this.showModal;
       this.modalService.openModal('quizModal');
    }
    onCloseModal(value:boolean){
      this.showModal = value;
    }
}
