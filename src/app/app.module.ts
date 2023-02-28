import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from './user/user.component';
import { RegisrationComponent } from './user/regisration/regisration.component';
import { LoginComponent } from './user/login/login.component';
import { ProfileComponent } from './user/profile/profile.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { UserService } from './chared/user.service';
import { HttpClientModule } from '@angular/common/http';
import { ProfilesComponent } from './user/profiles/profiles.component';
import { HomeComponent } from './home/home.component';

@NgModule({
    declarations: [
        AppComponent,
        UserComponent,
        RegisrationComponent,
        LoginComponent,
        ProfileComponent,
        NavMenuComponent,
        ProfilesComponent,
        HomeComponent

    ],
    providers: [UserService],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
      
    ],
    schemas:[CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA]
})
export class AppModule { }
