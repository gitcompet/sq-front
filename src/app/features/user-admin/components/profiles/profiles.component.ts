import { Component } from '@angular/core';
import { UserService } from 'src/app/features/user-profile/services/user.service';
import { User } from 'src/app/core/models/user.model';
@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styles: [],
})
export class ProfilesComponent {
  users: User[] = [];
  headers: string[] = ['First Name','Last Name','Email','Username'];
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getProfiles().subscribe((res) => {
     this.users = res;
     console.log(res);

    });
  }
}
