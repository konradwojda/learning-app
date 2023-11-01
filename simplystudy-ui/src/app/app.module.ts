import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthLoginComponent } from './auth-login/auth-login.component';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule } from "@angular/common/http";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { ReactiveFormsModule } from "@angular/forms";
import { AuthTokenInterceptor } from './auth-token.interceptor';
import { CsrfTokenInterceptor } from './csrf-token.interceptor';
import { AuthRegisterComponent } from './auth-register/auth-register.component';
import { QuestionSetsComponent } from './question-sets/question-sets.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { SearchResourcesComponent } from './search-resources/search-resources.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AuthLoginComponent,
    AuthRegisterComponent,
    DashboardComponent,
    BrowserModule,
    QuestionSetsComponent,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    NavigationComponent,
    LandingPageComponent,
    SearchResourcesComponent,
    AppRoutingModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    PageNotFoundComponent,
    ReactiveFormsModule,
    HttpClientXsrfModule.withOptions({ cookieName: 'csrftoken', headerName: 'X-CSRFToken' })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CsrfTokenInterceptor, multi: true },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { width: '70%' } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
