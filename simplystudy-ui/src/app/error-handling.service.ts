import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  constructor(
    private router: Router,
    private snackbarService: SnackbarService,
    private translate: TranslateService
  ) {}

  public handleError(error: HttpErrorResponse): void {
    if (error.status === 404) {
      this.snackbarService.showError(error);
      this.router.navigateByUrl('/404');
    } else if (error.status === 500) {
      this.snackbarService.showSnackbar(this.translate.instant("Snackbar.ServerError"));
    } else {
      this.snackbarService.showError(error);
    }
  }
}
