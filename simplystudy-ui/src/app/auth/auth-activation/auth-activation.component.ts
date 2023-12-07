import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-activation',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    TranslateModule,
    NgIf,
  ],
  templateUrl: './auth-activation.component.html',
  styleUrls: ['./auth-activation.component.css'],
})
export class AuthActivationComponent implements OnInit {
  activationForm: FormGroup;
  isWaiting = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router,
    private route: ActivatedRoute,
    private errorHandling: ErrorHandlingService,
    private translate: TranslateService,
  ) {
    this.activationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    const uid = this.route.snapshot.params['uid'];
    const token = this.route.snapshot.params['token'];
    if (uid && token) {
      this.activate(uid, token);
    } else {
      this.isWaiting = false;
    }
  }

  activate(uid: string, token: string) {
    this.authService.activate(uid, token).subscribe({
      error: (error) => {
        this.errorHandling.handleError(error);
      },
      complete: () => {
        this.snackbarService.showSnackbar(
          this.translate.instant('Snackbar.AccountActivate'),
        );
        this.router.navigateByUrl('/login');
      },
    });
  }

  resendActivation(email: string) {
    this.authService.resendActivation(email).subscribe({
      error: (error) => {
        this.errorHandling.handleError(error);
      },
      complete: () => {
        this.snackbarService.showSnackbar(
          this.translate.instant('Snackbar.ActivationEmailSent'),
        );
      },
    });
  }

  onSubmit(data: any) {
    if (this.activationForm.valid) {
      this.resendActivation(data.email);
    } else {
      this.snackbarService.showSnackbar(
        this.translate.instant('Snackbar.InvalidForm'),
      );
    }
  }
}
