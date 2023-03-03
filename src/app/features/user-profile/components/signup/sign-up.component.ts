import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-regisration',
  templateUrl: './signup.component.html',
  styles: [],
})
export class SignUpComponent {
  constructor(public authService: AuthService) {}
  ngOnInit() {

  }
   onsubmit() {

  }
}
