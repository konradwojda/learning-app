import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlingService } from '../../services/error-handling.service';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-auth-reset-password',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './auth-reset-password.component.html',
  styleUrls: ['./auth-reset-password.component.css'],
})
export class AuthResetPasswordComponent {
  resetPasswordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router,
    private route: ActivatedRoute,
    private errorHandling: ErrorHandlingService,
    private translate: TranslateService,
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', Validators.required],
      re_password: ['', Validators.required],
    });
  }

  resetPassword(password: string, re_password: string) {
    const uid = this.route.snapshot.params['uid'];
    const token = this.route.snapshot.params['token'];
    this.authService
      .resetPasswordConfirmation(password, re_password, uid, token)
      .subscribe({
        next: (data) => {
          this.snackbarService.showSnackbar(
            this.translate.instant('Snackbar.PasswordChangedSuccess'),
          );
          this.router.navigateByUrl('/login');
        },
        error: (error) => {
          this.errorHandling.handleError(error);
        },
      });
  }

  onSubmit(formData: any): void {
    if (this.resetPasswordForm.invalid) {
      console.log(this.resetPasswordForm.errors);
    } else {
      this.resetPassword(formData.password, formData.re_password);
    }
  }
}
