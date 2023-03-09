import { Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Input() id: string = '';
  @Input() data: FormGroup | any;
  @Input('showModal') showModal!: boolean;
  @Output('close') closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  private element: HTMLElement;
  constructor(private modalService: ModalService, private el: ElementRef,private renderer: Renderer2) {
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
    console.log(this.element);

   // this.renderer.appendChild(this.element.parentElement,this.element)
  }

  // close modal
  close(): void {
   this.closeModal.emit(true);
   this.modalService.remove(this.id);
   //this.renderer.removeChild(this.element.parentElement,this.element)
  }
}
