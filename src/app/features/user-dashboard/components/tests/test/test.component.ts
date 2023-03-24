import { Component, Input, OnInit } from '@angular/core';
import { ITestResponse } from 'src/app/core/models/test-response.model';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements OnInit {

  isExpanded: boolean = false;
  @Input() data!: ITestResponse;
  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  ngOnInit(): void {
  }
}
