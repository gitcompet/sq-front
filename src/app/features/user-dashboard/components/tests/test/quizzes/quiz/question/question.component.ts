import { Component, Input, OnInit } from '@angular/core';
import { extractName } from 'src/app/core/constants/settings';
import { IQuestionResponse } from 'src/app/core/models/question-response.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  @Input() data!: IQuestionResponse;
  isAdmin: boolean;
  isExpanded: boolean = false;

  extractName = extractName;
  constructor(private authService:AuthService,private modalService:ModalService){
    this.isAdmin = this.authService.isAdmin();
  }
  ngOnInit(): void {
  }
  onUpdateQuestion() {
    this.modalService.updateData(this.data);
    this.modalService.openModal({
      id: 'updateQuestionModal',
    });
  }
  onDeleteQuestion() {
    this.modalService.updateData(this.data);
    this.modalService.openModal({
      id: 'confirmationModal',
    });
  }
}
