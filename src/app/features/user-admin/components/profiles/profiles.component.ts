import { Component } from '@angular/core';
import { UserService } from 'src/app/features/user-profile/services/user.service';
import { User } from 'src/app/core/models/user.model';
@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styles: [],
})
export class ProfilesComponent {
  list: User[] = [];
  constructor(private service: UserService) {}

  ngOnInit() {
    // this.service.getProfiles().subscribe((res) => {
    //   this.list = res;
    //   console.log('profiles1 :' + JSON.stringify(this.list));
    // });
  }
}
