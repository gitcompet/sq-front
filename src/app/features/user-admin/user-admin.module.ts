import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './components/profiles/profile/profile.component';
import { ProfilesComponent } from './components/profiles/profiles.component';
import { RouterModule } from '@angular/router';
import { UserAdminRoutingModule } from './user-admin-routing.module';



@NgModule({
  declarations: [ProfileComponent,ProfilesComponent],
  imports: [
    CommonModule,
    UserAdminRoutingModule
  ],
  exports : [ProfileComponent,ProfilesComponent]
})
export class UserAdminModule { }
