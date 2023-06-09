import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { TableComponent } from './components/table/table.component';
import { ModalComponent } from './components/modal/modal.component';
import { NavbarSettingsComponent } from './components/navbar-settings/navbar-settings.component';
import { CheckBoxComponent } from './components/checkbox/checkbox.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmationModalComponent } from './components/modal/confirmation-modal/confirmation-modal.component';
import { StatsModule } from './modules/stats/stats.module';
import { SettingsPageComponent } from './components/settings-page/settings-page.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    PageNotFoundComponent,
    TableComponent,
    ModalComponent,
    NavbarSettingsComponent,
    CheckBoxComponent,
    ConfirmationModalComponent,
    SettingsPageComponent,
  ],
  exports: [
    PageNotFoundComponent,
    TableComponent,
    ModalComponent,
    ConfirmationModalComponent,
    NavbarSettingsComponent,
    CheckBoxComponent,
    SettingsPageComponent,
    StatsModule,
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
