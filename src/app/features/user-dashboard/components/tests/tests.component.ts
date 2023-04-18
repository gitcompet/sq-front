import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ITestResponse,
  TestResponse,
} from 'src/app/core/models/test-response.model';
import { QuizService } from 'src/app/features/user-admin/services/quiz.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css'],
})
export class TestsComponent implements OnInit {
  tests: ITestResponse[] = [];
  _subscriptions: Subscription[] = [];
  constructor(
    private modalService: ModalService,
    private quizService: QuizService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this._subscriptions.push(
      this.modalService.getDataExchange().subscribe((data) => {
        if (data && Object.hasOwn(data, 'testId')) {
          const test = data as ITestResponse;
          this.tests= this.tests.map((tst) => tst.testId === test.testId ? test: tst);

        }
      })
    );

    if (!this.authService.isAdmin()) {
      this._subscriptions.push(
        this.quizService
          .getUserTests(this.authService.getId())
          .subscribe((res: ITestResponse[]) => {
            this.tests = res;
          })
      );
    } else {
      this._subscriptions.push(
        this.quizService.getAvailableTests().subscribe((res) => {
          this.tests = res;
        })
      );
    }
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
