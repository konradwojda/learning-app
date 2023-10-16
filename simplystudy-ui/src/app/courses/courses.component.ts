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
import { FormsModule } from '@angular/forms';

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
      // create course
    })
  }

  createCourse(): void {
    const dialogRef = this.dialog.open(CourseEditDialog, { data: { name: '', description: '', university: '' } });
    dialogRef.afterClosed().subscribe(result => {
      // create course
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

export interface CourseData {
  name: string;
  university: string;
  description: string;
}

@Component({
  selector: 'app-courses-edit-dialog',
  templateUrl: 'courses-edit-dialog.html',
  styleUrls: ['./courses.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
})
export class CourseEditDialog {
  constructor(
    public dialogRef: MatDialogRef<CourseEditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: CourseData,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}