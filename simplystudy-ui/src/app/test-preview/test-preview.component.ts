import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Test } from '../tests/test';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorHandlingService } from '../error-handling.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf, NgSwitchCase } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-test-preview',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, TranslateModule, MatIconModule, NgFor, NgIf, NgSwitchCase, MatDialogModule],
  templateUrl: './test-preview.component.html',
  styleUrls: ['./test-preview.component.css']
})
export class TestPreviewComponent implements OnInit {

  testId: number;
  test: Test;
  private apiUrl = environment.apiUrl;

  constructor(private route: ActivatedRoute, private http: HttpClient, private errorHandling: ErrorHandlingService, public dialog: MatDialog, private router: Router) {
    this.testId = Number(this.route.snapshot.paramMap.get('id'));
    this.test = {id: -1, name: '', questions_count: -1, question_set: -1, questions: []};
  }

  ngOnInit(): void {
    this.getTest();
  }

  getTest(): void {
    this.http.get(this.apiUrl + '/api/test_details/' + this.testId + '/').subscribe({
      next: (data: any) => {
        this.test.id = data.id;
        this.test.name = data.name;
        this.test.question_set = data.question_set;
        this.test.questions_count = data.test_questions.length;
        this.test.questions = data.test_questions;
        console.log(this.test);
      },
      error: (error) => {
        this.errorHandling.handleError(error);
      }
    })
  }

  editTest(): void {
    const dialogRef = this.dialog.open(TestEditDialogComponent, {data: {name: this.test.name, id: this.test.id}})
    dialogRef.afterClosed().subscribe((result) => {
      this.http.patch(this.apiUrl + '/api/tests/' + this.test.id + '/', {name: result.name}).subscribe({
        next: (data) => {
          this.ngOnInit();
          this.router.navigateByUrl(this.router.url);
        },
        error: (error) => {
          this.errorHandling.handleError(error);
        }
      })
    })
  }

}

@Component({
  selector: 'app-test-preview-test-edit-dialog',
  templateUrl: 'test-edit-dialog.html',
  styleUrls: ['./test-preview.component.css'],
  standalone: true,
  imports: [TranslateModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule],
})
export class TestEditDialogComponent {
  private apiUrl = environment.apiUrl;

  constructor(
    public dialogRef: MatDialogRef<TestEditDialogComponent>,
    private http: HttpClient,
    private errorHandling: ErrorHandlingService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}