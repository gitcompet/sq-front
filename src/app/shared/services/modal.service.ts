import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: any[] = [];
  private _dataExchange : BehaviorSubject<unknown> = new BehaviorSubject<unknown>(null)
  private _dataExchange$ = this._dataExchange.asObservable();
  constructor() {
   }

  addModal(modal: any){
    this.modals.push(modal);
  }
  remove(id: string) {
    this.modals = this.modals.filter(x => x.id !== id);
}
  openModal(selectedModal: any){
    const modal = this.modals.find(x => x.id === selectedModal.id);
    modal.open();
  }
  closeModal(selectedModal: any){
    const modal = this.modals.find(x => x.id === selectedModal.id);
    modal.close();
  }
  updateData(data : unknown){
    this._dataExchange.next(data);
  }
  getDataExchange(): Observable<unknown>{
    return this._dataExchange$;
  }
}
