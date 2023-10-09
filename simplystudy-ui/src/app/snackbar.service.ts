import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackbar: MatSnackBar) { }

  showSnackbar(message: string, action: string = 'Close') {
    this.snackbar.open(message, action, { duration: 5000, horizontalPosition: "right", verticalPosition: "top" });
  }
}
