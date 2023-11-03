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
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, ReactiveFormsModule, TranslateModule]
})
export class AuthLoginComponent implements OnInit {
  logInForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private snackbarService: SnackbarService, private router: Router, private errorHandling: ErrorHandlingService) {
    this.logInForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  logInUser(user: UserCredentials): void {
    this.authService.logIn(user.username, user.password).subscribe({
      next: (data) => {
        data.username = user.username;
        this.authService.setLoggedInUser(data);
        this.authService.setIsAuthenticated(true);
        this.snackbarService.showSnackbar('Logged in successfully');
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
}
