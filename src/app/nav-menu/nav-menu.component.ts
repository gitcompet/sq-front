import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../chared/user.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styles: [
  ]
})
export class NavMenuComponent implements OnInit {
  isAuthenticated: boolean =false;
  /**
   *
   */
  constructor(private router: Router, private service:UserService) {
    // super();

  }

  ngOnInit(): void {
console.log('isauthen:' + this.isAuthenticated);
  }
  onLogout()
  {
  localStorage.removeItem('token');
  this.router.navigate(['user/login']);
  }

  isLoggedIn() {
    this.isAuthenticated = this.service.isLoggedIn();
  }

}
