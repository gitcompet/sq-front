import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DTO } from 'src/app/core/models/dto.model';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() id: string = '';
  //DYNAMIC DATA COMING FROM THE CALLING PARENT
  @Input() data: FormGroup | any;
  @Output('onSave') dataEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Input('showModal') showModal!: boolean;
  private element: HTMLElement;
  private _data: unknown;
  constructor(private modalService: ModalService, private el: ElementRef) {
    this.element = el.nativeElement;
  }
  ngOnInit(): void {
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }
    this.modalService.addModal(this);
  }

  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();
  }

  // open modal
  open(): void {
    this.showModal = true;
  }
  save() {
    if (this.data instanceof FormGroup) {
      if (this.data.valid) {
        this.dataEmitter.emit(this.data);
      }
    }else{
      this.dataEmitter.emit(this.data);
    }
  }

  // close modal
  close(): void {
    this.showModal = false;
    if (this._data) {
      this.modalService.updateData({ data: this._data } as DTO);
    }
  }
}
