import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilesComponent } from './components/profiles/profiles.component';
import { ProfileComponent } from './components/profiles/profile/profile.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  { path: 'profiles', component: ProfilesComponent,canActivate:[AuthGuard], children :[
    { path: ':id',component: ProfileComponent}
  ] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class UserAdminRoutingModule {}
