import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styles: [],
})
export class NavMenuComponent implements OnInit {
  isAuthenticated: boolean = false;
  routes: string[]=['','','']
  constructor(private router: Router, private authService:AuthService) {
    // super();
  }

  ngOnInit(): void {
    console.log('isauthen:' + this.isAuthenticated);
  }
  onLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/user/login']);
  }

  isLoggedIn() {
    this.isAuthenticated = this.authService.isLoggedIn();
  }
}
