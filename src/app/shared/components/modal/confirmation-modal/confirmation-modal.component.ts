import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent implements OnInit, OnDestroy {
  id: string = 'confirmationModal';
  @Output('onSave') dataEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Input('showModal') showModal!: boolean;
  private element: HTMLElement;
  private _data: unknown;
  constructor(private modalService: ModalService, private el: ElementRef) {
    this.element = el.nativeElement;
  }
  ngOnInit(): void {
    this.modalService.getDataExchange().subscribe((data)=>{
        this._data = data;
    })
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
  onConfirmed(isConfirmed:boolean) {
   this.dataEmitter.emit({isConfirmed,userId: this._data})
  }

  // close modal
  close(): void {
    this.showModal = false;
    if (this._data) {
      this.modalService.updateData({ data: this._data });
    }
  }
}
