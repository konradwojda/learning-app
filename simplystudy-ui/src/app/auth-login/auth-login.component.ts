import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { UserCredentials } from "../auth";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarService } from '../snackbar.service';
import { Router } from '@angular/router';
import { ErrorHandlingService } from '../error-handling.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, ReactiveFormsModule, TranslateModule, NgIf]
})
export class AuthLoginComponent implements OnInit {
  logInForm: FormGroup;
  resetPasswordForm: FormGroup;
  showResetPassword = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private snackbarService: SnackbarService, private router: Router, private errorHandling: ErrorHandlingService, private translate: TranslateService) {
    this.logInForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  ngOnInit(): void {
  }

  logInUser(user: UserCredentials): void {
    this.authService.logIn(user.username, user.password).subscribe({
      next: (data) => {
        data.username = user.username;
        this.authService.setLoggedInUser(data);
        this.authService.setIsAuthenticated(true);
        this.snackbarService.showSnackbar(this.translate.instant("Snackbar.LoggedIn"));
        this.router.navigateByUrl('/dashboard');
      },
      error: (error) => {
        this.errorHandling.handleError(error);
      }
    }
    );
  }

  onSubmit(formData: UserCredentials): void {
    if (this.logInForm.invalid) {
      console.log(this.logInForm.errors);
    } else {
      this.logInUser(formData);
    }
  }

  setShowResetPassword(): void {
    this.showResetPassword = !this.showResetPassword;
  }

  resetPassword(data: any): void {
    this.authService.resetPassword(data.email).subscribe({
      next: (data) => {
        this.snackbarService.showSnackbar(this.translate.instant("Snackbar.PasswordResetEmailSent"));
      },
      error: (error) => {
        this.errorHandling.handleError(error);
      }
    })
  }
}