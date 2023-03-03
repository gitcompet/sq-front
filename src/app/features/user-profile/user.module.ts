import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/signup/sign-up.component';
import { UserRoutingModule } from './user-routing.module';



@NgModule({
  declarations: [LoginComponent,SignUpComponent],
  imports: [
    CommonModule,
    UserRoutingModule
  ],
  exports: [LoginComponent,SignUpComponent],
})
export class UserModule { }
