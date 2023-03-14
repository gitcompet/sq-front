import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LanguagesComponent } from './components/languages/languages.component';
import { LanguageComponent } from './components/languages/language/language.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  { path: 'languages', component: LanguagesComponent,canActivate:[AuthGuard], children :[
      { path: ':language', component: LanguageComponent }
  ] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class LanguageManagementRoutingModule {}
