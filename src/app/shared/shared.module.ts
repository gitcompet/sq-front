import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [PageNotFoundComponent,NavMenuComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [PageNotFoundComponent,NavMenuComponent],
})
export class SharedModule { }
