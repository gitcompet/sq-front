import {  NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { UserDashboardModule } from './features/user-dashboard/user-dashboard.module';
import { UserAdminModule } from './features/user-admin/user-admin.module';
import { UserModule } from './features/user-profile/user.module';

@NgModule({
    declarations: [
    AppComponent
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        //CUSTOM MODULES
        CoreModule,
        SharedModule,
        UserDashboardModule,
        UserAdminModule,
        UserModule,
        //LEAVE IT AT THE END OF THE ROUTES
        AppRoutingModule
    ]
})
export class AppModule { }
