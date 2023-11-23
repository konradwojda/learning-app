import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from './course';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { SnackbarService } from '../snackbar.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { ErrorHandlingService } from '../error-handling.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-courses',
  standalone: true,
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
  imports: [
    CommonModule,
    MatDividerModule,
    MatRippleModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatIconModule,
    MatCardModule,
    TranslateModule,
  ],
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    public dialog: MatDialog,
    private router: Router,
    private errorHandling: ErrorHandlingService,
    private translate: TranslateService,
  ) {}

  deleteCourse(course_id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {data: {message: this.translate.instant("ConfirmDialog.DeleteCourse")}, maxWidth: '400px'});
    dialogRef.afterClosed().subscribe((result) => {
      if(result) {
        this.http
          .delete(this.apiUrl + '/api/courses/' + course_id + '/')
          .subscribe({
            next: (data) => {
              this.snackbarService.showSnackbar(
                this.translate.instant('Snackbar.CourseDeleted'),
              );
              this.ngOnInit();
              this.router.navigateByUrl(this.router.url);
            },
            error: (error) => {
              this.errorHandling.handleError(error);
            },
          });
      }
    })
  }

  editCourse(course: Course): void {
    const dialogRef = this.dialog.open(CourseEditDialogComponent, {
      data: {
        name: course.name,
        description: course.description,
        university: course.university,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      result.owner = this.authService.getUsername();
      this.http
        .put(this.apiUrl + '/api/courses/' + course.id + '/', result)
        .subscribe({
          next: (data) => {
            this.snackbarService.showSnackbar(
              this.translate.instant('Snackbar.CourseUpdated'),
            );
            this.ngOnInit();
            this.router.navigateByUrl(this.router.url);
          },
          error: (error) => {
            for (const err in error.error) {
              this.snackbarService.showSnackbar(
                err + ': ' + error.error[err][0],
              );
            }
          },
        });
    });
  }

  createCourse(): void {
    const dialogRef = this.dialog.open(CourseEditDialogComponent, {
      data: { name: '', description: '', university: '' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      result.owner = this.authService.getUsername();
      this.http.post(this.apiUrl + '/api/courses/', result).subscribe({
        next: (data) => {
          this.snackbarService.showSnackbar(
            this.translate.instant('Snackbar.CourseAdded'),
          );
          this.ngOnInit();
          this.router.navigateByUrl(this.router.url);
        },
        error: (error) => {
          for (const err in error.error) {
            this.snackbarService.showSnackbar(err + ': ' + error.error[err][0]);
          }
        },
      });
    });
  }

  ngOnInit(): void {
    const username = this.authService.getUsername();
    this.http
      .get<Course[]>(this.apiUrl + '/api/courses/?username=' + username)
      .subscribe({
        next: (data: Course[]) => {
          this.courses = data;
        },
        error: (error) => {
          this.errorHandling.handleError(error);
        },
      });
  }
}

@Component({
  selector: 'app-courses-edit-dialog',
  templateUrl: 'courses-edit-dialog.html',
  styleUrls: ['./courses.component.css'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class CourseEditDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CourseEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Course,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
