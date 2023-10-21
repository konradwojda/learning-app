import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLoginComponent } from './auth-login/auth-login.component';
import { AuthRegisterComponent } from './auth-register/auth-register.component';
import { QuestionSetsComponent } from './question-sets/question-sets.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateQuestionSetComponent } from './create-question-set/create-question-set.component';
import { CoursesComponent } from './courses/courses.component';

const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'login', component: AuthLoginComponent },
    { path: 'register', component: AuthRegisterComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'question_sets/:id', component: QuestionSetsComponent },
    { path: 'create_question_set', component: CreateQuestionSetComponent },
    { path: 'courses', component: CoursesComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }