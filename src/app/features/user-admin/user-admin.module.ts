import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './components/profiles/profile/profile.component';
import { ProfilesComponent } from './components/profiles/profiles.component';
import { UserAdminRoutingModule } from './user-admin-routing.module';
import { HomeComponent } from './components/home/home.component';
import { SidebarMenuComponent } from './components/sidebar-menu/sidebar-menu.component';
import { MainContentComponent } from './components/home/main-content/main-content.component';
import { QuizAdminComponent } from './components/test/quiz/quiz-admin.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LanguageComponent } from './components/languages/language/language.component';
import { LanguagesComponent } from './components/languages/languages.component';
import { UserModule } from '../user-profile/user.module';
import { CoreModule } from 'src/app/core/core.module';
import { TestsAdminComponent } from './components/test/tests-admin.component';
import { UserDashboardModule } from "../user-dashboard/user-dashboard.module";
import { QuestionAdminComponent } from './components/test/quiz/question/question-admin.component';
import { MoreInfoComponent } from './more-info/more-info.component';

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
        QuestionAdminComponent,
        MoreInfoComponent,
    ],
    exports: [
        ProfileComponent,
        ProfilesComponent,
        HomeComponent,
        SidebarMenuComponent,
        MainContentComponent,
        TestsAdminComponent,
        QuizAdminComponent,
        QuestionAdminComponent,
        LanguagesComponent,
        LanguageComponent,
    ],
    imports: [CommonModule, UserAdminRoutingModule, SharedModule, CoreModule, UserModule, ReactiveFormsModule, UserDashboardModule]
})
export class UserAdminModule {}
