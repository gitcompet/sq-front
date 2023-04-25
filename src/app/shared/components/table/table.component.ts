import { KeyValue } from '@angular/common';
import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
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
  @Input() data: IUser[] | IQuestion[] | any = [];
  @Input() title: string = '';
  @Input() headers: string[] = [];
  @Output('onSave') dataEmitter: EventEmitter<any> = new EventEmitter<any>();
  _subscriptions: Subscription[] = [];
  @ViewChild(ActionHostDirective, { static: true })
  actionHost!: ActionHostDirective;
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
  }

  getRowContext(row: any) {
    const rowKey: string = Object.keys(row).find((keyName) =>
      keyName.match(/(id|login)/i)
    )!;
    return { $implicit: row[rowKey], data: row };
  }
  // Preserve original property order
  originalOrder = (
    a: KeyValue<number, any>,
    b: KeyValue<number, any>
  ): number => {
    return 0;
  };
  isObject(value: any) {
    return typeof value === 'object';
  }

}
