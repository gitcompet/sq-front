import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit {
  formModel = {
    UserName: '',
    Password: '',
  };
  isLoggedin: boolean = false;
  users: User[] = [];
  isAuthenticated: boolean = false;
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    console.log('form Model:', this.formModel.UserName);
    if (localStorage.getItem('token') != null) this.router.navigate(['/home']);
    {
    }
    this.isLoggedIn();
  }

  onSubmit(form: NgForm) {
    this.authService.login(form.value).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);

        this.router.navigateByUrl('/home');
        // login successful if there's a jwt token in the response
        if (res && res.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(res.user));
          this.isLoggedin = true;
        }
      },

      error: (err) => console.log(err),
      complete: () => console.log('completed'),
    });
  }

  isLoggedIn() {
    this.isAuthenticated = this.authService.isLoggedIn();
  }
}
