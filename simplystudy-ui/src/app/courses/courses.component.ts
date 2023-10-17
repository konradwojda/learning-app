import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from './course';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { SnackbarService } from '../snackbar.service';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-courses',
  standalone: true,
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
  imports: [CommonModule, MatListModule, MatDividerModule, MatRippleModule, MatButtonModule, MatIconModule, MatDialogModule],
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService, private snackbarService: SnackbarService, public dialog: MatDialog) {
  }

  editCourse(course: Course): void {
    const dialogRef = this.dialog.open(CourseEditDialog, { data: { name: course.name, description: course.description, university: course.university } });
    dialogRef.afterClosed().subscribe(result => {
      result.owner = this.authService.getUsername();
      this.http.put(this.apiUrl + '/api/courses/' + course.id + '/', result).subscribe({
        next: (data) => {
          this.snackbarService.showSnackbar("Successfully updated course");
          window.location.reload();
        },
        error: (error) => {
          for (var err in error.error) {
            this.snackbarService.showSnackbar(err + ': ' + error.error[err][0]);
          }
        }
      });
    })
  }

  createCourse(): void {
    const dialogRef = this.dialog.open(CourseEditDialog, { data: { name: '', description: '', university: '' } });
    dialogRef.afterClosed().subscribe(result => {
      result.owner = this.authService.getUsername();
      this.http.post(this.apiUrl + '/api/courses/', result).subscribe({
        next: (data) => {
          this.snackbarService.showSnackbar("Successfully added new course");
          window.location.reload();
        },
        error: (error) => {
          for (var err in error.error) {
            this.snackbarService.showSnackbar(err + ': ' + error.error[err][0]);
          }
        }
      });
    })
  }

  ngOnInit(): void {
    let username = this.authService.getUsername();
    this.http.get<Course[]>(this.apiUrl + '/api/courses/?username=' + username).subscribe({
      next: (data: Course[]) => {
        this.courses = data;
      },
      error: (error) => {
        this.snackbarService.showSnackbar(error.error.detail);
      }
    })
  }
}

@Component({
  selector: 'app-courses-edit-dialog',
  templateUrl: 'courses-edit-dialog.html',
  styleUrls: ['./courses.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule],
})
export class CourseEditDialog {
  nameFieldControl = new FormControl('', [Validators.required])
  universityFieldControl = new FormControl('', [Validators.required])

  constructor(
    public dialogRef: MatDialogRef<CourseEditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Course,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}