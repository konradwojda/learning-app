import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLoginComponent } from './auth-login/auth-login.component';
import { AuthRegisterComponent } from './auth-register/auth-register.component';
import { QuestionSetsComponent } from './question-sets/question-sets.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateQuestionSetComponent } from './create-question-set/create-question-set.component';
import { CoursesComponent } from './courses/courses.component';
import { SearchResourcesComponent } from './search-resources/search-resources.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MyResourcesComponent } from './my-resources/my-resources.component';
import { LearnComponent } from './learn/learn.component';
import { AuthGuard } from './auth.guard';
import { AuthActivationComponent } from './auth-activation/auth-activation.component';

const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'login', component: AuthLoginComponent },
    { path: 'register', component: AuthRegisterComponent },
    { path: 'activate/:uid/:token', component: AuthActivationComponent },
    { path: 'activate', component: AuthActivationComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'question_sets/:id', component: QuestionSetsComponent, canActivate: [AuthGuard] },
    { path: 'create_question_set', component: CreateQuestionSetComponent, canActivate: [AuthGuard] },
    { path: 'courses', component: CoursesComponent, canActivate: [AuthGuard] },
    { path: 'search_resources', component: SearchResourcesComponent, canActivate: [AuthGuard] },
    { path: 'my_resources', component: MyResourcesComponent, canActivate: [AuthGuard] },
    { path: 'learn/:id', component: LearnComponent, canActivate: [AuthGuard] },
    { path: '404', component: PageNotFoundComponent },
    { path: '**', pathMatch: 'full', redirectTo: '/404' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }