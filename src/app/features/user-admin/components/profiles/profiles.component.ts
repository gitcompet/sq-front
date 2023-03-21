import { Component } from '@angular/core';
import { UserService } from 'src/app/features/user-profile/services/user.service';
import { IUser } from 'src/app/core/models/user.model';
import { ModalService } from 'src/app/shared/services/modal.service';
@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styles: [],
})
export class ProfilesComponent {
  users: IUser[] = [];
  headers: string[] = ['First Name','Last Name','Email','Username'];
  showModal: boolean = false;

  constructor(private userService: UserService,private modalService:ModalService) {}

  ngOnInit() {
    this.userService.getProfiles().subscribe((res: IUser[]) => {
     this.users = res;
     console.log(res);

    });
  }
  onAddUser(){
    this.showModal = !this.showModal;
    this.modalService.openModal({ id: 'addUserModal', isShown: this.showModal });
  }
}
