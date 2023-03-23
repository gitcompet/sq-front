import { Component, Input } from '@angular/core';
import { ITestResponse } from 'src/app/core/models/test-response.model';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent {
  isExpanded: boolean = false;
  @Input() data!: ITestResponse;
  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
