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
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-test-editor',
  standalone: true,
  imports: [MatFormFieldModule, MatStepperModule, ReactiveFormsModule, TranslateModule, NgFor, FormsModule, MatInputModule, MatButtonModule, MatSelectModule, NgIf, MatMenuModule, MatIconModule],
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

  addQuestion(type: string): void {
    const questionArray = this.testQuestionsData.get('questions') as FormArray;
    switch (type) {
      case "TEXT":
        questionArray.push(
          this._formBuilder.group({
            content: ['', Validators.required],
            answer: ['', Validators.required],
            type: ["TEXT", Validators.required],
          }),
        );
        break;
      case "SINGLE":
        questionArray.push(
          this._formBuilder.group({
            content: ['', Validators.required],
            answers: this._formBuilder.array([]),
            type: ["SINGLE", Validators.required],
          }),
        );
        break;
      case "MULTIPLE":
        questionArray.push(
          this._formBuilder.group({
            content: ['', Validators.required],
            answers: this._formBuilder.array([]),
            type: ["MULTIPLE", Validators.required],
          }),
        );
        break;
      case "TF":
        questionArray.push(
          this._formBuilder.group({
            content: ['', Validators.required],
            type: ["TF", Validators.required],
          }),
        );
        break;

      default:
        break;
    }
  }

  removeQuestion(idx: number): void {
    const questionArray = this.testQuestionsData.get('questions') as FormArray;
    questionArray.removeAt(idx);
  }

  addOption(questionIndex: number): void {
    const questionArray = this.testQuestionsData.get('questions') as FormArray;
    const answers = (questionArray.at(questionIndex).get('answers') as FormArray);
    answers.push(this._formBuilder.group({
      answer: ['', Validators.required],
      is_correct: ['', Validators.required],
    }));
  }

  removeOption(questionIdx: number, answerIdx: number): void {
    const questionArray = this.testQuestionsData.get('questions') as FormArray;
    const answers = (questionArray.at(questionIdx).get('answers') as FormArray);
    answers.removeAt(answerIdx);
  }

  getAnswerControls(questionIdx: number) {
    const questionArray = this.testQuestionsData.get('questions') as FormArray;
    const answers = (questionArray.at(questionIdx).get('answers') as FormArray);
    return answers.controls;
  }

  postTest(): void {

  }
}
