import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [],
})
export class HomeComponent {
  /**
   *
   */
  constructor(private router: Router) {}
  ngOnInit() {}
  olLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/user/login']);
  }
}
