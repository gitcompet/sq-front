import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { RouterModule } from '@angular/router';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';

export function tokenGetter() {
  return localStorage.getItem("access_token");
}

@NgModule({
  declarations: [PageNotFoundComponent,NavMenuComponent],
  imports: [
    CommonModule,
    RouterModule,
    JwtModule.forRoot({ // for JwtHelperService
      config: {tokenGetter:tokenGetter}
    })
  ],
  exports: [PageNotFoundComponent,NavMenuComponent],
})
export class SharedModule { }
