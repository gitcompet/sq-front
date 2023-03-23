import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './user-home.component.html',
  styles: [],
})
export class UserHomeComponent {
  data: any = {};
  constructor(private authService: AuthService,private router: Router){}
  ngOnInit() {
    this.data.username = this.authService.getUsername();
  }
  onLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/user/login']);
  }
}
