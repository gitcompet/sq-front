import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { passwordMatchingValidator } from 'src/app/core/constants/settings';
import { SignUp } from 'src/app/core/models/signup.model';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-regisration',
  templateUrl: './signup.component.html',
  styles: [],
})
export class SignUpComponent {
  constructor(
    public authService: AuthService,
    private _formBuilder: FormBuilder
  ) {}
  signUpForm: FormGroup = this._formBuilder.group({
    username: new FormControl('',[Validators.minLength(3)]),
    email: new FormControl('',[Validators.email]),
    fullName: new FormControl('',[Validators.minLength(3)]),
    password: new FormControl('',[
      Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/),
      passwordMatchingValidator('confirmPassword',true)
    ]),
    confirmPassword: new FormControl('',[
      Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/),
      passwordMatchingValidator('password')
    ]),
  } as unknown as SignUp,{validators: [Validators.required]});
  ngOnInit() {
   }
  onSignUp() {
    if (!this.signUpForm.valid) return;
    this.authService.signUp(this.signUpForm.value).subscribe((res) => {
      console.log('Signed up');
    });
  }
}
