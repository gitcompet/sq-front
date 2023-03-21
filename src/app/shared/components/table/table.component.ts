import { KeyValue } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ActionHostDirective } from 'src/app/core/directives/action-host.directive';
import { IQuestion, Question } from 'src/app/core/models/question.model';
import { IUser } from 'src/app/core/models/user.model';
import { ModalService } from '../../services/modal.service';
import { CheckBoxComponent } from '../checkbox/checkbox.component';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  @Input() data: IUser[] | IQuestion[] | any[] = [];
  @Input() title: string = '';
  @Input() headers: string[] = [];
  @Input() actions: any[] = [];
  _subscriptions: Subscription[] = [];
  @ViewChild(ActionHostDirective, { static: true })actionHost!: ActionHostDirective;
  constructor(private modalService: ModalService) {}
  ngOnInit() {
    this._subscriptions.push(
      this.modalService.getDataExchange().subscribe((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          this.data = data;
        }
      })
    );
    this.loadComponents();
  }
  loadComponents() {
    if (this.actions && this.actions.length > 0) {
      console.log(this.actionHost);

      // const viewContainerRef = this.actionHost.viewContainerRef;
      // viewContainerRef.clear();
      // const componentRef =
      //   viewContainerRef.createComponent<CheckBoxComponent>(this.actions[0].componentName);
    }
  }

  // Preserve original property order
  originalOrder = (
    a: KeyValue<number, string>,
    b: KeyValue<number, string>
  ): number => {
    return 0;
  };
}
