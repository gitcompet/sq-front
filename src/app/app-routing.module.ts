import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common'
import { UserComponent } from './user/user.component';
import {RegisrationComponent} from './user/regisration/regisration.component';
import { LoginComponent } from './user/login/login.component';
import { ProfilesComponent } from './user/profiles/profiles.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path:'',redirectTo:'/', pathMatch:'full'},
  {path:'home', component:HomeComponent, canActivate:[AuthGuard]},
  {path:'user',component:UserComponent,
  children:[
    {path:'registration', component:RegisrationComponent},
    {path:'login', component:LoginComponent},
    {path:'profiles', component:ProfilesComponent},
   
  ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
