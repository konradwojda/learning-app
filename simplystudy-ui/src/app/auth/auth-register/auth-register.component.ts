import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RegisterUserData } from '../auth';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { ErrorHandlingService } from '../../services/error-handling.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-register',
  templateUrl: './auth-register.component.html',
  styleUrls: ['./auth-register.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class AuthRegisterComponent {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router,
    private errorHandling: ErrorHandlingService,
    private translate: TranslateService,
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      re_password: ['', Validators.required],
      email: ['', Validators.required],
    });
  }

  registerUser(user: RegisterUserData): void {
    this.authService
      .registerUser(user.username, user.password, user.re_password, user.email)
      .subscribe({
        error: (error) => {
          this.errorHandling.handleError(error);
        },
        complete: () => {
          this.snackbarService.showSnackbar(
            this.translate.instant('Snackbar.RegisterActivation'),
          );
          this.router.navigateByUrl('/activate');
        },
      });
  }

  onSubmit(formData: RegisterUserData): void {
    if (this.registerForm.invalid) {
      console.log(this.registerForm.errors);
    } else {
      this.registerUser(formData);
    }
  }
}
