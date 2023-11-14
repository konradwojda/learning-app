import { Component } from '@angular/core';
import { TestQuestion } from './questions';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from '../snackbar.service';
import { ErrorHandlingService } from '../error-handling.service';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgFor, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-test-editor',
  standalone: true,
  imports: [MatFormFieldModule, MatStepperModule, ReactiveFormsModule, TranslateModule, NgFor, FormsModule, MatInputModule, MatButtonModule, MatSelectModule, NgIf, MatMenuModule, MatIconModule, MatRadioModule, MatCheckboxModule, MatCardModule],
  templateUrl: './test-editor.component.html',
  styleUrls: ['./test-editor.component.css']
})
export class TestEditorComponent {
  questionSetId: number;
  private apiUrl = environment.apiUrl;

  testData = this._formBuilder.group({
    name: ['', Validators.required],
  });

  testQuestionsData = this._formBuilder.group({
    questions: this._formBuilder.array([]),
  }) as FormGroup;

  questions = this.testQuestionsData.get('questions') as FormArray;

  constructor(private http: HttpClient, private snackbarService: SnackbarService, private errorHandling: ErrorHandlingService, private _formBuilder: FormBuilder, private route: ActivatedRoute, private translate: TranslateService, private router: Router) {
    this.questionSetId = Number(this.route.snapshot.paramMap.get('id'));
  }

  loadTest(test_id: number): void {
    this.http.get(this.apiUrl + '/api/tests/' + test_id + '/').subscribe({
      next: (response: any) => {
        this.testData.patchValue({name: response.name});
      }
    })
  }

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
            is_correct: [true, Validators.required],
            type: ['TF', Validators.required],
          })
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
      is_correct: [false, Validators.required],
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

  onCheckCorrectSingle(questionIdx: number, answerIdx: number): void {
    const questionArray = this.testQuestionsData.get('questions') as FormArray;
    const answers = (questionArray.at(questionIdx).get('answers') as FormArray);

    for (let i = 0; i < answers.length; i++) {
      const answerControl = answers.at(i);
      answerControl.patchValue({ is_correct: false });
    }

    const selectedAnswer = answers.at(answerIdx);
    selectedAnswer.patchValue({ is_correct: true });
  }

  postTest(): void {
    this.http.post(this.apiUrl + '/api/tests/', { name: this.testData.value.name, question_set: this.questionSetId }).subscribe({
      next: (response: any) => {
        for (const testQuestion of this.testQuestionsData.value.questions) {
          if (testQuestion.type === 'TF') {
            const question: TestQuestion = {
              test_id: response.id,
              question: testQuestion.content,
              question_type: testQuestion.type,
              answers: [{answer: "True", is_correct: testQuestion.is_correct}, {answer: "False", is_correct: !testQuestion.is_correct}],
            }
            this.postQuestion(question);
          } else if (testQuestion.type === 'TEXT') {
            const question: TestQuestion = {
              test_id: response.id,
              question: testQuestion.content,
              question_type: testQuestion.type,
              answers: [{answer: testQuestion.answer, is_correct: true}],
            }
            this.postQuestion(question);
          } else {
            const question: TestQuestion = {
              test_id: response.id,
              question: testQuestion.content,
              question_type: testQuestion.type,
              answers: testQuestion.answers,
            }
            this.postQuestion(question);
          }
        }
      },
      error: (error) => {
        this.errorHandling.handleError(error);
      }
    })
  }

  postQuestion(data: TestQuestion): void {
    this.http.post(this.apiUrl + '/api/test_questions/', { test: data.test_id, question: data.question, question_type: data.question_type }).subscribe({
      next: (response: any) => {
        const answersArray = data.answers;
        for (const answer of answersArray) {
          this.http.post(this.apiUrl + '/api/test_questions_answers/', { text: answer.answer, is_correct: answer.is_correct, question: response.id }).subscribe({
            next: (response: any) => {
              this.router.navigateByUrl('/tests/' + this.questionSetId);
              this.snackbarService.showSnackbar(this.translate.instant("Snackbar.AddedTest"));
            },
            error: (error) => {
              this.errorHandling.handleError(error);
            }
          })
        }
      },
      error: (error) => {
        this.errorHandling.handleError(error);
      }
    })
  }
}
