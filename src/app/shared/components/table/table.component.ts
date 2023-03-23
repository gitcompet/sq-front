import { KeyValue } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ActionHostDirective } from 'src/app/core/directives/action-host.directive';
import { IQuestion } from 'src/app/core/models/question.model';
import { IUser } from 'src/app/core/models/user.model';
import { ModalService } from '../../services/modal.service';
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
  @Output('onSave') dataEmitter: EventEmitter<any> = new EventEmitter<any>();
  _subscriptions: Subscription[] = [];
  @ViewChild(ActionHostDirective, { static: true })actionHost!: ActionHostDirective;
  @ContentChild(TemplateRef) templateRef!: TemplateRef<any>;
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
  getRowContext(row: any) {
    const rowKey: string = Object.keys(row).find((keyName)=> keyName.match(/id/i))!;

    return {$implicit: row[rowKey]};
  }
  // Preserve original property order
  originalOrder = (
    a: KeyValue<number, string>,
    b: KeyValue<number, string>
  ): number => {
    return 0;
  };
}
