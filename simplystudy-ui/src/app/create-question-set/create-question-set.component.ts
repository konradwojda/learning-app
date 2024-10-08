import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../services/auth.service';
import { Course } from '../courses/course';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from '../services/snackbar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { CsvService } from '../services/csv.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ErrorHandlingService } from '../services/error-handling.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-question-set',
  standalone: true,
  templateUrl: './create-question-set.component.html',
  styleUrls: ['./create-question-set.component.css'],
  imports: [
    CommonModule,
    MatStepperModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    MatSlideToggleModule,
    TranslateModule,
  ],
})
export class CreateQuestionSetComponent implements OnInit {
  @ViewChild('csvInput', { static: false }) csvInput: ElementRef | undefined;
  private apiUrl = environment.apiUrl;

  courseList: Array<Course> = [];
  isPrivate = true;

  questionSetData = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    course: new FormControl(),
    is_private: ['', Validators.required],
  });
  questionsData = this.formBuilder.group({
    questions: this.formBuilder.array([]),
  }) as FormGroup;

  questions = this.questionsData.get('questions') as FormArray;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private snackbarService: SnackbarService,
    private router: Router,
    private csv: CsvService,
    private errorHandling: ErrorHandlingService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    const username = this.authService.getUsername();
    this.http
      .get<Course[]>(this.apiUrl + '/api/courses/?username=' + username)
      .subscribe({
        next: (data: Course[]) => {
          this.courseList = data;
        },
        error: (error) => {
          this.errorHandling.handleError(error);
        },
      });
  }

  addQuestion(): void {
    const questionArray = this.questionsData.get('questions') as FormArray;
    questionArray.push(
      this.formBuilder.group({
        content: ['', Validators.required],
        answer: ['', Validators.required],
        image: new FormControl(''),
      }),
    );
  }

  removeQuestion(index: number) {
    const questionArray = this.questionsData.get('questions') as FormArray;
    questionArray.removeAt(index);
  }

  onImageUpload(event: Event, question_idx: number): void {
    const files = (event.target as HTMLInputElement).files;
    if (files != null) {
      const img = files[0];
      const quetsionArray = this.questionsData.get('questions') as FormArray;
      quetsionArray.at(question_idx).patchValue({ image: img });
      (event.target as HTMLInputElement).value = '';
    }
  }

  deleteImage(question_idx: number): void {
    const questionArray = this.questionsData.get('questions') as FormArray;
    questionArray.at(question_idx).patchValue({ image: '' });
  }

  postQuestionSet(): void {
    const formValue = this.questionSetData.value;
    const username = this.authService.getUsername();
    this.http
      .post(this.apiUrl + '/api/question_sets/', {
        name: formValue.name,
        description: formValue.description,
        course: formValue.course ? formValue.course.id : null,
        owner: username,
        is_private: formValue.is_private,
      })
      .subscribe({
        next: (set_data: any) => {
          const questionsArr: Array<any> = this.questionsData.value.questions;
          for (const question of questionsArr) {
            const question_form = new FormData();
            question_form.append('content', question.content);
            question_form.append('answer', question.answer);
            question_form.append('image', question.image);
            question_form.append('question_set', set_data.id);
            this.http
              .post(this.apiUrl + '/api/questions/', question_form)
              .subscribe({
                error: (error) => {
                  this.errorHandling.handleError(error);
                },
                complete: () => {
                  this.snackbarService.showSnackbar(
                    this.translate.instant('Snackbar.QSAdded'),
                  );
                  this.router.navigateByUrl('/question_sets/' + set_data.id);
                },
              });
          }
          this.snackbarService.showSnackbar(
            this.translate.instant('Snackbar.QSAdded'),
          );
          this.router.navigateByUrl('/question_sets/' + set_data.id);
        },
        error: (error) => {
          this.errorHandling.handleError(error);
        },
      });
  }

  async importCsvQuestions(event: Event) {
    const csvString = await this.getTextFromFile(event);
    const questions = this.csv.importCSV(csvString);
    const questionArray = this.questionsData.get('questions') as FormArray;
    for (const question of questions) {
      questionArray.push(
        this.formBuilder.group({
          content: [question.content, Validators.required],
          answer: [question.answer, Validators.required],
          image: new FormControl(''),
        }),
      );
    }
    if (this.csvInput) {
      this.csvInput.nativeElement.value = '';
    }
  }

  private async getTextFromFile(event: any) {
    const file: File = event.target.files[0];
    const fileContent = await file.text();

    return fileContent;
  }
}
