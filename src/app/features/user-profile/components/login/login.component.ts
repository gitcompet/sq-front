import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/core/models/login.model';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit {
  isLoggedin: boolean = false;
  isAuthenticated: boolean = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private _formBuilder: FormBuilder
  ) {}
  loginForm: FormGroup = this._formBuilder.group({
    username: new FormControl('',[Validators.minLength(3)]),
    password: new FormControl('',[Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/g)])
  } as unknown as Login,{validators: [Validators.required]});

  ngOnInit(): void {

  }
  onLogin() {
    if (!this.loginForm.valid) return;
    if(this.loginForm.valid) console.log("Yes");
    return;

    this.authService.login(this.loginForm.value).subscribe(() => {
      console.log('Logged in');
    });
  }
  isLoggedIn() {
    this.isAuthenticated = this.authService.isLoggedIn();
  }
}
