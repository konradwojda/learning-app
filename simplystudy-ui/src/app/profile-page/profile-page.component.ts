import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserInfo } from '../auth';
import { ErrorHandlingService } from '../error-handling.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { SnackbarService } from '../snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-page',
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
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  user: UserInfo | null = null;
  changePasswordForm: FormGroup;
  changeUsernameForm: FormGroup;
  showChangePassword = false;
  showChangeUsername = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private errorHandling: ErrorHandlingService, private snackbarService: SnackbarService, private router: Router, private translate: TranslateService){
    this.changePasswordForm = this.formBuilder.group({
      new_password: ['', [Validators.required]],
      re_new_password: ['', [Validators.required]],
      current_password: ['', Validators.required]
    });
    this.changeUsernameForm = this.formBuilder.group({
      new_username: ['', [Validators.required]],
      current_password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe({
      next: (response) => {
        this.user = response;
      },
      error: (error) => {
        this.errorHandling.handleError(error);
      }
    })
  }
  changePassword(data: any) {
    this.authService.setPassword(data.new_password, data.re_new_password, data.current_password).subscribe({
      next: (response) => {
        this.ngOnInit();
        this.router.navigateByUrl(this.router.url);
        this.snackbarService.showSnackbar(this.translate.instant("Snackbar.ChangedPass"));
      },
      error: (error) => {
        this.errorHandling.handleError(error);
      }
    })
  }

  changeUsername(data: any) {
    this.authService.changeUsername(data.new_username, data.current_password).subscribe({
      next: (response: any) => {
        this.authService.setUsername(data.new_username);
        this.ngOnInit();
        this.router.navigateByUrl(this.router.url);
        this.snackbarService.showSnackbar(this.translate.instant("Snackbar.ChangedUsername"));
      },
      error: (error) => {
        this.errorHandling.handleError(error);
      }
    })
  }

  setShowChangePassword() { 
    if(this.showChangeUsername) {
      this.showChangeUsername = false;
    }
    this.showChangePassword = !this.showChangePassword;
  }

  setShowChangeUsername() {
    if(this.showChangePassword) {
      this.showChangePassword = false;
    }
    this.showChangeUsername = !this.showChangeUsername;
  }

}
