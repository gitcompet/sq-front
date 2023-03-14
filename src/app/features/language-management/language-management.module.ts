import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageComponent } from './components/languages/language/language.component';
import { LanguagesComponent } from './components/languages/languages.component';
import { RouterModule } from '@angular/router';
import { LanguageManagementRoutingModule } from './language-management-routing.module';



@NgModule({
  declarations: [LanguageComponent, LanguagesComponent],
  imports: [
    CommonModule,
    LanguageManagementRoutingModule
  ],
  exports: [LanguageComponent, LanguagesComponent]
})
export class LanguageManagementModule { }
