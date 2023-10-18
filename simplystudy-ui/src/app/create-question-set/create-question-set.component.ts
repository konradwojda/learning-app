import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../auth.service';
import { Course } from '../courses/course';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from '../snackbar.service';

@Component({
  selector: 'app-create-question-set',
  standalone: true,
  templateUrl: './create-question-set.component.html',
  styleUrls: ['./create-question-set.component.css'],
  imports: [CommonModule, MatStepperModule, MatButtonModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule, MatSelectModule],
})
export class CreateQuestionSetComponent implements OnInit {
  private apiUrl = environment.apiUrl;

  courseList: Array<Course> = [];

  questionSetData = this._formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    course: [''],

  });
  questionsData = this._formBuilder.group({
    questions: this._formBuilder.array([])
  }) as FormGroup;

  questions = this.questionsData.get('questions') as FormArray;

  constructor(private _formBuilder: FormBuilder, private authService: AuthService, private http: HttpClient, private snackbarService: SnackbarService) {

  }

  ngOnInit(): void {
    let username = this.authService.getUsername();
    this.http.get<Course[]>(this.apiUrl + '/api/courses/?username=' + username).subscribe({
      next: (data: Course[]) => {
        this.courseList = data;
      },
      error: (error) => {
        this.snackbarService.showSnackbar(error.error.detail);
      }
    })
  }

  addQuestion(): void {
    const questionArray = this.questionsData.get('questions') as FormArray;
    questionArray.push(this._formBuilder.group({
      content: ['', Validators.required],
      answer: ['', Validators.required]
    }))
  }

  removeQuestion(index: number) {
    const questionArray = this.questionsData.get('questions') as FormArray;
    questionArray.removeAt(index);
  }
}
