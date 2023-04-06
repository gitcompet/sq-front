import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './user-home.component.html',
  styles: [],
})
export class UserHomeComponent {
  data: any = {};
  constructor(private authService: AuthService){}
  ngOnInit() {
    this.data.username = this.authService.getUsername();
  }
 }
