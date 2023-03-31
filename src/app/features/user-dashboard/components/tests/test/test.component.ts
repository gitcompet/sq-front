import { Component, Input, OnInit } from '@angular/core';
import { ITestResponse } from 'src/app/core/models/test-response.model';
import { extractName } from 'src/app/core/constants/settings';
import { QuizService } from 'src/app/features/user-admin/services/quiz.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { AuthService } from 'src/app/shared/services/auth.service';
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements OnInit {
  isExpanded: boolean = false;
  isAdmin: boolean = false;
  extractName = extractName;
  @Input() data!: ITestResponse;
  constructor(private quizService: QuizService,private modalService: ModalService,private authService: AuthService){}
  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
  }
  toggle() {
    this.isExpanded = !this.isExpanded;
  }
  onUpdateTest(){
    this.modalService.updateData(this.data);
    this.modalService.openModal({
      id: 'updateTestModal'
    });
  }
  onDeleteTest(){
    this.modalService.updateData(this.data);
    this.modalService.openModal({
      id: 'confirmationModal'
    });
  }


}
