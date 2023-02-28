import { Component } from '@angular/core';
import { User } from 'src/app/chared/user.model';
import { UserService } from 'src/app/chared/user.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styles: [
  ]
})
export class ProfilesComponent {

  list:Array<User> = [];
  data:Array<any>;

  constructor(private service:UserService){
    this.data=[
      {firstName:'John', lastName:'Doe', age:'35'},
      {firstName:'Michael', lastName:'Smith', age:'39'}
    ];
  }

  ngOnInit()
  {
    this.service.GetProfiles();
    this.service.GetProfiles1().subscribe(
      res=>{ this.list= res as User[];
        console.log('profiles1 :'+JSON.stringify(this.list));

    },

    );

  }

}
