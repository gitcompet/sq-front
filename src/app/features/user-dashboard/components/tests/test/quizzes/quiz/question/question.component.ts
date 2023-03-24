import { Component, Input, OnInit } from '@angular/core';
import { IQuestionResponse } from 'src/app/core/models/question-response.model';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  @Input() data!: IQuestionResponse;
  ngOnInit(): void {
  }

}
