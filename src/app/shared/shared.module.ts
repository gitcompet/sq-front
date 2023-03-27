import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { TableComponent } from './components/table/table.component';
import { ModalComponent } from './components/modal/modal.component';
import { NavbarSettingsComponent } from './components/navbar-settings/navbar-settings.component';
import { CheckBoxComponent } from './components/checkbox/checkbox.component';
import { ReactiveFormsModule } from '@angular/forms';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    PageNotFoundComponent,
    NavMenuComponent,
    TableComponent,
    ModalComponent,
    NavbarSettingsComponent,
    CheckBoxComponent,
  ],
  exports: [
    PageNotFoundComponent,
    NavMenuComponent,
    TableComponent,
    ModalComponent,
    NavbarSettingsComponent,
    CheckBoxComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      // for JwtHelperService
      config: { tokenGetter: tokenGetter },
    }),
  ],
})
export class SharedModule {}
