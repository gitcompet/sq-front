import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './components/profiles/profile/profile.component';
import { ProfilesComponent } from './components/profiles/profiles.component';
import { UserAdminRoutingModule } from './user-admin-routing.module';
import { HomeComponent } from './components/home/home.component';
import { SidebarMenuComponent } from './components/home/sidebar-menu/sidebar-menu.component';
import { MainContentComponent } from './components/home/main-content/main-content.component';



@NgModule({
  declarations: [ProfileComponent,ProfilesComponent, HomeComponent, SidebarMenuComponent, MainContentComponent],
  imports: [
    CommonModule,
    UserAdminRoutingModule
  ],
  exports : [ProfileComponent,ProfilesComponent]
})
export class UserAdminModule { }
