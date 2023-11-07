import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackbar: MatSnackBar) { }

  showSnackbar(message: string, action = 'Close') {
    this.snackbar.open(message, action, { duration: 5000, horizontalPosition: "right", verticalPosition: "top" });
  }

  showError(error: any): void {
    if (error.error.detail) {
      this.snackbar.open(error.error.detail, 'Close', { duration: 5000, horizontalPosition: "right", verticalPosition: "top" });
    }
    else {
      for (const err in error.error) {
        if (err === 'non_field_errors') {
          this.snackbar.open(error.error[err][0], 'Close', { duration: 5000, horizontalPosition: "right", verticalPosition: "top" });
        } else {
          this.snackbar.open(err + ': ' + error.error[err][0], 'Close', { duration: 5000, horizontalPosition: "right", verticalPosition: "top" });
        }

      }
    }
  }
}
