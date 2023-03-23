import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './components/profiles/profile/profile.component';
import { ProfilesComponent } from './components/profiles/profiles.component';
import { UserAdminRoutingModule } from './user-admin-routing.module';
import { HomeComponent } from './components/home/home.component';
import { SidebarMenuComponent } from './components/sidebar-menu/sidebar-menu.component';
import { MainContentComponent } from './components/home/main-content/main-content.component';
<<<<<<< HEAD
import { TestComponent } from './components/test/test.component';
import { QuizComponent } from './components/test/quiz/quiz.component';
import { QuestionComponent } from './components/test/quiz/question/question.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProfileComponent,
    ProfilesComponent,
    HomeComponent,
    SidebarMenuComponent,
    MainContentComponent,
    TestComponent,
    QuizComponent,
    QuestionComponent,
  ],
  exports: [
    ProfileComponent,
    ProfilesComponent,
    HomeComponent,
    SidebarMenuComponent,
    MainContentComponent,
    TestComponent,
    QuizComponent,
    QuestionComponent,
  ],
  imports: [CommonModule, UserAdminRoutingModule, SharedModule,ReactiveFormsModule],
=======
import { QuizAdminComponent } from './components/test/quiz/quiz-admin.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LanguageComponent } from './components/languages/language/language.component';
import { LanguagesComponent } from './components/languages/languages.component';
import { UserModule } from '../user-profile/user.module';
import { CoreModule } from 'src/app/core/core.module';
import { TestsAdminComponent } from './components/test/tests-admin.component';
import { UserDashboardModule } from "../user-dashboard/user-dashboard.module";

@NgModule({
    declarations: [
        ProfileComponent,
        ProfilesComponent,
        HomeComponent,
        SidebarMenuComponent,
        MainContentComponent,
        TestsAdminComponent,
        QuizAdminComponent,
        LanguagesComponent,
        LanguageComponent,
    ],
    exports: [
        ProfileComponent,
        ProfilesComponent,
        HomeComponent,
        SidebarMenuComponent,
        MainContentComponent,
        TestsAdminComponent,
        QuizAdminComponent,
        LanguagesComponent,
        LanguageComponent,
    ],
    imports: [CommonModule, UserAdminRoutingModule, SharedModule, CoreModule, UserModule, ReactiveFormsModule, UserDashboardModule]
>>>>>>> developement
})
export class UserAdminModule {}
