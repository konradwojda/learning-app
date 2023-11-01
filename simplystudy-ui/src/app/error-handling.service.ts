import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor(private router: Router, private snackbarService: SnackbarService) { }

  public handleError(error: HttpErrorResponse): void {
    if (error.status === 404) {
      this.snackbarService.showError(error);
      this.router.navigateByUrl("/404");
    }
    else {
      this.snackbarService.showError(error);
    }
  }
}
