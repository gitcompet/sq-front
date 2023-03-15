import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './components/profiles/profile/profile.component';
import { ProfilesComponent } from './components/profiles/profiles.component';
import { UserAdminRoutingModule } from './user-admin-routing.module';
import { HomeComponent } from './components/home/home.component';
import { SidebarMenuComponent } from './components/sidebar-menu/sidebar-menu.component';
import { MainContentComponent } from './components/home/main-content/main-content.component';
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
})
export class UserAdminModule {}
