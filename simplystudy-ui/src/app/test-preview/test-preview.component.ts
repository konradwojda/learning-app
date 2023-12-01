import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Test } from '../tests/test';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorHandlingService } from '../services/error-handling.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf, NgSwitchCase } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { SnackbarService } from '../services/snackbar.service';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../services/auth.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-test-preview',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, TranslateModule, MatIconModule, NgFor, NgIf, NgSwitchCase, MatDialogModule, MatMenuModule],
  templateUrl: './test-preview.component.html',
  styleUrls: ['./test-preview.component.css']
})
export class TestPreviewComponent implements OnInit {

  testId: number;
  test: Test;
  isOwner = false;
  private apiUrl = environment.apiUrl;

  constructor(private route: ActivatedRoute, private http: HttpClient, private errorHandling: ErrorHandlingService, public dialog: MatDialog, private router: Router, private snackbarService: SnackbarService, private translate: TranslateService, private authService: AuthService) {
    this.testId = Number(this.route.snapshot.paramMap.get('id'));
    this.test = { id: -1, name: '', questions_count: -1, question_set: -1, questions: [] };
  }

  ngOnInit(): void {
    this.getTest();
  }

  deleteTest(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { data: { message: this.translate.instant("ConfirmDialog.DeleteTest") }, maxWidth: '400px' });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.http.delete(this.apiUrl + '/api/tests/' + this.testId + '/').subscribe({
          next: (data) => {
            this.router.navigateByUrl('/question_sets/' + this.test.question_set + '/tests');
            this.snackbarService.showSnackbar(this.translate.instant('Snackbar.DeletedTest'));
          },
          error: (error) => {
            this.errorHandling.handleError(error);
          }
        })
      }
    })
  }

  deleteTestQuestion(question_id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { data: { message: this.translate.instant("ConfirmDialog.DeleteQuestion") }, maxWidth: '400px' });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.http.delete(this.apiUrl + '/api/test_questions/' + question_id + '/').subscribe({
          next: (data) => {
            this.ngOnInit();
            this.router.navigateByUrl(this.router.url);
            this.snackbarService.showSnackbar(this.translate.instant('Snackbar.QuestionDeleted'));
          },
          error: (error) => {
            this.errorHandling.handleError(error);
          }
        })
      }
    })
  }

  getTest(): void {
    this.http.get(this.apiUrl + '/api/test_details/' + this.testId + '/').subscribe({
      next: (data: any) => {
        this.test.id = data.id;
        this.test.name = data.name;
        this.test.question_set = data.question_set;
        this.test.questions_count = data.test_questions.length;
        this.test.questions = data.test_questions;
        if (this.test.question_set.owner === this.authService.getUsername()) {
          this.isOwner = true;
        }
      },
      error: (error) => {
        this.errorHandling.handleError(error);
      }
    })
  }

  addQuestion(type: string): void {
    const dialogRef = this.dialog.open(AddTestQuestionDialogComponent, { data: { test_id: this.testId, question: '', question_type: type, is_true: type === 'TF' ? true : null, answers: [] } });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.http.post(this.apiUrl + '/api/test_questions/', { test: result.test_id, question: result.question, question_type: result.question_type, is_true: result.is_true, question_choices: result.answers }).subscribe({
          next: (response: any) => {
            this.ngOnInit();
            this.router.navigateByUrl(this.router.url);
            this.snackbarService.showSnackbar(this.translate.instant("Snackbar.QuestionAdded"));
          },
          error: (error) => {
            this.errorHandling.handleError(error);
          }
        })
      }
    })
  }

  editTest(): void {
    const dialogRef = this.dialog.open(TestEditDialogComponent, { data: { name: this.test.name, id: this.test.id } });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.http.patch(this.apiUrl + '/api/tests/' + this.test.id + '/', { name: result.name }).subscribe({
          next: (data) => {
            this.ngOnInit();
            this.router.navigateByUrl(this.router.url);
          },
          error: (error) => {
            this.errorHandling.handleError(error);
          }
        })
      }
    })
  }

  editQuestion(question: any): void {
    const dialogRef = this.dialog.open(TestQuestionEditDialogComponent, {
      data: { id: question.id, question: question.question, question_type: question.question_type, answers: question.question_choices, is_true: question.is_true }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.http.patch(this.apiUrl + '/api/test_questions/' + result.id + '/', { test: this.testId, question: result.question, question_type: result.question_type, is_true: result.is_true, question_choices: result.answers }).subscribe({
          next: (response) => {
            this.ngOnInit();
            this.router.navigateByUrl(this.router.url);
            this.snackbarService.showSnackbar(this.translate.instant("Snackbar.EditedTest"));
          },
          error: (error) => {
            this.ngOnInit();
            this.router.navigateByUrl(this.router.url);
            this.errorHandling.handleError(error);
          }
        });

      }
    });
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
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-test-preview-test-question-edit-dialog',
  templateUrl: 'test-question-edit-dialog.html',
  styleUrls: ['./test-preview.component.css'],
  standalone: true,
  imports: [TranslateModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule, NgIf, MatIconModule, NgFor, MatCheckboxModule, MatRadioModule],
})
export class TestQuestionEditDialogComponent {
  private apiUrl = environment.apiUrl;

  constructor(
    public dialogRef: MatDialogRef<TestQuestionEditDialogComponent>,
    private http: HttpClient,
    private snackbarService: SnackbarService,
    private errorHandling: ErrorHandlingService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  onCheckCorrectSingle(answerIdx: number): void {
    for (let i = 0; i < this.data.answers.length; i++) {
      this.data.answers[i].is_correct = false;
    }
    this.data.answers[answerIdx].is_correct = true;
  }

  addAnswer(): void {
    this.data.answers.push({ id: null, text: '', is_correct: false })
  }

  deleteAnswer(answerIdx: number): void {
    const id = this.data.answers[answerIdx].id
    this.data.answers.splice(answerIdx, 1);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-test-preview-add-test-question-dialog',
  templateUrl: 'add-test-question-dialog.html',
  styleUrls: ['./test-preview.component.css'],
  standalone: true,
  imports: [TranslateModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule, NgIf, MatIconModule, NgFor, MatCheckboxModule, MatRadioModule],
})
export class AddTestQuestionDialogComponent implements OnInit {
  private apiUrl = environment.apiUrl;

  constructor(
    public dialogRef: MatDialogRef<AddTestQuestionDialogComponent>,
    private snackbarService: SnackbarService,
    private errorHandling: ErrorHandlingService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit(): void {
    if (this.data.question_type === 'TEXT') {
      this.data.answers.push({ text: '', is_correct: true });
    }
  }

  onCheckCorrectSingle(answerIdx: number): void {
    for (let i = 0; i < this.data.answers.length; i++) {
      this.data.answers[i].is_correct = false;
    }
    this.data.answers[answerIdx].is_correct = true;
  }

  addAnswer(): void {
    this.data.answers.push({ text: '', is_correct: false })
  }

  deleteAnswer(answerIdx: number): void {
    this.data.answers.splice(answerIdx, 1);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}