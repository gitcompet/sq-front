import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-more-info',
  templateUrl: './more-info.component.html',
  styleUrls: ['./more-info.component.css'],
})
export class MoreInfoComponent implements OnInit {
  user: IUser;
  constructor(private router: Router) {
    this.user = this.router.getCurrentNavigation()?.extras.state as IUser;
  }
  ngOnInit(): void {
    console.log(this.user);

  }
}
