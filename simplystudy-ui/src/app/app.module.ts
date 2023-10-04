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

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AuthLoginComponent,
    BrowserModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    NavigationComponent,
    AppRoutingModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    HttpClientXsrfModule.withOptions({ cookieName: 'csrftoken', headerName: 'X-CSRFToken' })
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
