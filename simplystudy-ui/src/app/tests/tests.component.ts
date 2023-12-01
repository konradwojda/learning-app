import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuestionSet } from '../question-sets/question-set';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlingService } from '../services/error-handling.service';
import { Test } from './test';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SnackbarService } from '../services/snackbar.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tests',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, TranslateModule, NgFor, MatIconModule, MatRippleModule, MatTooltipModule, NgIf],
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css']
})
export class TestsComponent implements OnInit {
  questionSet: QuestionSet;
  tests: Test[] = [];
  isOwner = false;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService, private route: ActivatedRoute, private errorHandling: ErrorHandlingService, private router: Router, private snackbarService: SnackbarService, private translate: TranslateService, private dialog: MatDialog) {
    this.questionSet = {
      id: '',
      name: '',
      description: '',
      course: null,
      questions: '',
      owner: '',
      is_private: null,
    };
  }

  ngOnInit(): void {
    this.getQuestionSet();
    this.getTests();
  }

  getQuestionSet(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http
      .get<QuestionSet>(this.apiUrl + '/api/question_sets/' + id + '/')
      .subscribe({
        next: (data: QuestionSet) => {
          this.questionSet = {
            id: data.id,
            name: data.name,
            description: data.description,
            course: data.course,
            questions: data.questions,
            owner: data.owner,
            is_private: data.is_private,
          };
          if (this.questionSet.owner === this.authService.getUsername()) {
            this.isOwner = true;
          }
        },
        error: (error) => {
          this.errorHandling.handleError(error);
        },
      });
  }

  getTests(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http.get<Test[]>(this.apiUrl + '/api/tests/?question_set=' + id).subscribe({
      next: (data: Test[]) => {
        this.tests = data
      },
      error: (error) => {
        this.errorHandling.handleError(error);
      }
    })
  }

  deleteTest(test_id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { data: { message: this.translate.instant("ConfirmDialog.DeleteTest") }, maxWidth: '400px' });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.http.delete(this.apiUrl + '/api/tests/' + test_id).subscribe({
          next: (data) => {
            this.ngOnInit();
            this.router.navigateByUrl(this.router.url);
            this.snackbarService.showSnackbar(this.translate.instant("Snackbar.DeletedTest"));
          },
          error: (error) => {
            this.errorHandling.handleError(error);
          }
        })
      }
    })
  }

  showSet(): void {
    this.router.navigateByUrl('/question_sets/' + this.questionSet.id);
  }

  learn(): void {
    this.router.navigateByUrl('/learn/' + this.questionSet.id);
  }

  addTest(): void {
    this.router.navigateByUrl('/question_sets/' + this.questionSet.id + '/test_editor/new');
  }

  takeTest(test_id: number): void {
    this.router.navigateByUrl('/tests/' + test_id + '/take')
  }

  previewTest(test_id: number): void {
    this.router.navigateByUrl('/tests/' + test_id);
  }

  getTestDownloadUrl(test_id: number, test_name: string): void {
    this.http.get(this.apiUrl + '/download_test/' + test_id, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        const downloadUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = test_name + '.pdf';
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
      },
      error: (error) => {
        this.errorHandling.handleError(error);
      }
    })
  }
}
