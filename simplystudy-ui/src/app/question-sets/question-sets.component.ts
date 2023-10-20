import { Component, Inject, OnInit } from '@angular/core';
import { QuestionSet } from './question-set';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { environment } from 'src/environments/environment';
import { SnackbarService } from '../snackbar.service';
import { Router } from '@angular/router';
import { Course } from '../courses/course';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-question-sets',
  templateUrl: './question-sets.component.html',
  styleUrls: ['./question-sets.component.css'],
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatListModule, NgFor, MatIconModule, MatDialogModule]
})
export class QuestionSetsComponent implements OnInit {
  questionSet: QuestionSet;
  private apiUrl = environment.apiUrl;

  constructor(private route: ActivatedRoute, private http: HttpClient, private snackbarService: SnackbarService, private router: Router, private authService: AuthService, public dialog: MatDialog) {
    this.questionSet = {
      id: '',
      name: '',
      description: '',
      course: {} as Course,
      questions: '',
      owner: ''
    }
  }

  ngOnInit(): void {
    this.getQuestionSet();
  }

  getQuestionSet(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http.get<QuestionSet>(this.apiUrl + '/api/question_sets/' + id + '/').subscribe({
      next: (data: QuestionSet) => this.questionSet = {
        id: data.id,
        name: data.name,
        description: data.description,
        course: data.course,
        questions: data.questions,
        owner: data.owner,
      },
      error: (error) => {
        this.snackbarService.showSnackbar(error.error.detail);
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
        this.snackbarService.showSnackbar(error);
      }
    })
  }

  editQuestionSet(): void {
    const dialogRef = this.dialog.open(QuestionSetEditDialog, { data: { name: this.questionSet.name, description: this.questionSet.description, course: this.questionSet.course as Course } });
    dialogRef.afterClosed().subscribe(result => {
      let username = this.authService.getUsername();
      this.http.patch(this.apiUrl + '/api/question_sets/' + this.questionSet.id + '/', { name: result.name, description: result.description, course: result.course ? result.course.id : null, owner: username }).subscribe({
        next: (data) => {
          this.snackbarService.showSnackbar("Saved question set");
          window.location.reload();
        },
        error: (error) => {
          this.snackbarService.showSnackbar(error);
        }
      })
    })
  }
}

@Component({
  selector: 'app-question-sets-edit-dialog',
  templateUrl: 'question-set-edit-dialog.html',
  styleUrls: ['./question-sets.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule, MatOptionModule, MatSelectModule, NgFor],
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