import { Component, Inject, OnInit } from '@angular/core';
import { QuestionSet } from './question-set';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { environment } from 'src/environments/environment';
import { SnackbarService } from '../snackbar.service';
import { Router } from '@angular/router';
import { Course } from '../courses/course';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ErrorHandlingService } from '../error-handling.service';

@Component({
  selector: 'app-question-sets',
  templateUrl: './question-sets.component.html',
  styleUrls: ['./question-sets.component.css'],
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatListModule, NgFor, MatIconModule, MatDialogModule, NgIf]
})
export class QuestionSetsComponent implements OnInit {
  questionSet: QuestionSet;
  isOwner: boolean = false;
  private apiUrl = environment.apiUrl;

  constructor(private route: ActivatedRoute, private http: HttpClient, private snackbarService: SnackbarService, private router: Router, private authService: AuthService, public dialog: MatDialog, private errorHandling: ErrorHandlingService) {
    this.questionSet = {
      id: '',
      name: '',
      description: '',
      course: null,
      questions: '',
      owner: '',
      is_private: null,
    }
  }

  ngOnInit(): void {
    this.getQuestionSet();
  }

  getQuestionSet(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http.get<QuestionSet>(this.apiUrl + '/api/question_sets/' + id + '/').subscribe({
      next: (data: QuestionSet) => {
        this.questionSet = {
          id: data.id,
          name: data.name,
          description: data.description,
          course: data.course,
          questions: data.questions,
          owner: data.owner,
          is_private: data.is_private,
        }
        if (this.questionSet.owner === this.authService.getUsername()) {
          this.isOwner = true;
        }
      },
      error: (error) => {
        this.errorHandling.handleError(error);
      }
    });
  }

  deleteQuestionSet(id: string): void {
    this.http.delete(this.apiUrl + '/api/question_sets/' + id + '/').subscribe({
      next: (data) => {
        this.snackbarService.showSnackbar("Deleted course");
        this.router.navigateByUrl('/dashboard');
      },
      error: (error) => {
        this.errorHandling.handleError(error);
      }
    })
  }

  editQuestionSet(): void {
    const dialogRef = this.dialog.open(QuestionSetEditDialog, { data: { name: this.questionSet.name, description: this.questionSet.description, course: this.questionSet.course as Course, is_private: this.questionSet.is_private } });
    dialogRef.afterClosed().subscribe(result => {
      let username = this.authService.getUsername();
      this.http.patch(this.apiUrl + '/api/question_sets/' + this.questionSet.id + '/', { name: result.name, description: result.description, course: result.course ? result.course.id : null, owner: username, is_private: result.is_private }).subscribe({
        next: (data) => {
          this.snackbarService.showSnackbar("Saved question set");
          this.ngOnInit();
          this.router.navigateByUrl(this.router.url);
        },
        error: (error) => {
          this.errorHandling.handleError(error);
        }
      })
    })
  }

  editQuestion(question: any): void {
    const dialogRef = this.dialog.open(QuestionEditDialog, { data: { content: question.content, answer: question.answer, image: question.image, id: question.id } })
    dialogRef.afterClosed().subscribe(result => {
      this.http.patch(this.apiUrl + '/api/questions/' + question.id + '/', { content: result.content, answer: result.answer }).subscribe({
        next: (data) => {
          this.snackbarService.showSnackbar("Updated question");
          this.ngOnInit();
          this.router.navigateByUrl(this.router.url);
        }
      })
    })
  }

  addQuestion(question_set_id: string): void {
    const dialogRef = this.dialog.open(QuestionCreateDialog, { data: { content: '', answer: '', image: '', } });
    dialogRef.afterClosed().subscribe(result => {
      let question_form = new FormData();
      question_form.append('content', result.content)
      question_form.append('answer', result.answer)
      question_form.append('image', result.image)
      question_form.append('question_set', question_set_id)
      this.http.post(this.apiUrl + "/api/questions/", question_form).subscribe({
        next: (data) => {
          this.snackbarService.showSnackbar("Added question");
          this.ngOnInit();
          this.router.navigateByUrl(this.router.url);
        },
        error: (error) => {
          this.ngOnInit();
          this.router.navigateByUrl(this.router.url);
          this.errorHandling.handleError(error);
        }
      })
    })
  }

  deleteQuestion(question_id: string): void {
    this.http.delete(this.apiUrl + '/api/questions/' + question_id + '/').subscribe({
      next: (data) => {
        this.ngOnInit();
        this.router.navigateByUrl(this.router.url);
        this.snackbarService.showSnackbar("Deleted question");
      },
      error: (error) => {
        this.ngOnInit();
        this.router.navigateByUrl(this.router.url);
        this.errorHandling.handleError(error);
      }
    })
  }
}


@Component({
  selector: 'app-question-sets-edit-dialog',
  templateUrl: 'question-set-edit-dialog.html',
  styleUrls: ['./question-sets.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule, MatOptionModule, MatSelectModule, NgFor, MatSlideToggleModule],
})
export class QuestionSetEditDialog {
  private apiUrl = environment.apiUrl;
  courses: Array<Course> = [];

  constructor(
    public dialogRef: MatDialogRef<QuestionSetEditDialog>,
    private authService: AuthService,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.getCourses();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getCourses(): void {
    let username = this.authService.getUsername();
    this.http.get<Course[]>(this.apiUrl + '/api/courses/?username=' + username).subscribe({
      next: (data: Course[]) => {
        this.courses = data;
      },
      error: (error) => {

      }
    })
  }

  compareById(c1: Course, c2: Course): boolean {
    return c1 && c2 && c1.id === c2.id;
  }

}

@Component({
  selector: 'app-question-sets-question-edit-dialog',
  templateUrl: 'question-edit-dialog.html',
  styleUrls: ['./question-sets.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule, MatOptionModule, MatSelectModule, NgFor, MatIconModule, NgIf, MatTooltipModule],
})
export class QuestionEditDialog {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<QuestionEditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
    window.location.reload();
  }

  onImageUpload(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files != null) {
      const img = files[0];
      this.data.image = img;
    }
    let question_form = new FormData();
    question_form.append('image', this.data.image);
    this.http.patch(this.apiUrl + '/api/questions/' + this.data.id + '/', question_form).subscribe({
      next: (result: any) => {
        this.data.image = result.image;
      }
    });
  }

  deleteImage(): void {
    this.data.image = null;
    this.http.patch(this.apiUrl + '/api/questions/' + this.data.id + '/', { image: null }).subscribe();
  }

}

@Component({
  selector: 'app-question-sets-question-create-dialog',
  templateUrl: 'question-create-dialog.html',
  styleUrls: ['./question-sets.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule, MatOptionModule, MatSelectModule, NgFor, MatIconModule, NgIf, MatTooltipModule],
})
export class QuestionCreateDialog {


  constructor(
    public dialogRef: MatDialogRef<QuestionCreateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
    window.location.reload();
  }

  onImageUpload(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files != null) {
      const img = files[0];
      this.data.image = img;
      (event.target as HTMLInputElement).value = '';
    }
  }

  deleteImage(): void {
    this.data.image = null;
  }

}