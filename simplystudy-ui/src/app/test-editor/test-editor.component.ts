import { Component } from '@angular/core';
import { TestQuestion, QuestionType, TestQuestionAnswer } from './questions';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from '../snackbar.service';
import { ErrorHandlingService } from '../error-handling.service';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslateModule } from '@ngx-translate/core';
import { NgFor, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-test-editor',
  standalone: true,
  imports: [MatFormFieldModule, MatStepperModule, ReactiveFormsModule, TranslateModule, NgFor, FormsModule, MatInputModule, MatButtonModule, MatSelectModule, NgIf],
  templateUrl: './test-editor.component.html',
  styleUrls: ['./test-editor.component.css']
})
export class TestEditorComponent {
  testQuestionTypes: QuestionType[] = [
    { type: "TEXT", visible_type: "Tekstowe" },
    { type: "SINGLE", visible_type: "Pojedyńczy wybór" },
    { type: "MULTIPLE", visible_type: "Wielokrotny wybór" },
    { type: "TF", visible_type: "Prawda/Fałsz" }];
  testQuestions: TestQuestion[] = [];

  testData = this._formBuilder.group({
    name: ['', Validators.required],
  });

  testQuestionsData = this._formBuilder.group({
    questions: this._formBuilder.array([]),
  }) as FormGroup;

  questions = this.testQuestionsData.get('questions') as FormArray;

  constructor(private http: HttpClient, private snackbarService: SnackbarService, private errorHandling: ErrorHandlingService, private _formBuilder: FormBuilder) { }

  addQuestion(): void {
    const questionArray = this.testQuestionsData.get('questions') as FormArray;
    questionArray.push(
      this._formBuilder.group({
        content: ['', Validators.required],
        answers: ['', Validators.required],
        type: ["TEXT", Validators.required],
      }),
    );
  }

  removeQuestion(idx: number): void {
    const questionArray = this.testQuestionsData.get('questions') as FormArray;
    questionArray.removeAt(idx);
  }

  postTest(): void {

  }
}
