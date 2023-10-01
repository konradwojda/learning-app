import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import { AuthLoginComponent } from './auth-login/auth-login.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthLoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    NavigationComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
