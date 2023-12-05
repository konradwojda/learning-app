import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../services/error-handling.service';
import { SnackbarService } from '../services/snackbar.service';
import { environment } from 'src/environments/environment';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TestToTake, TestQuestion } from './test-data';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-take-test',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, TranslateModule, NgFor, NgIf, MatFormFieldModule, ReactiveFormsModule, FormsModule, MatInputModule, MatRadioModule, MatCheckboxModule, NgStyle, MatDividerModule],
  templateUrl: './take-test.component.html',
  styleUrls: ['./take-test.component.css']
})
export class TakeTestComponent implements OnInit {
  test: TestToTake;
  testId: number;
  private apiUrl = environment.apiUrl;

  constructor(private route: ActivatedRoute, private http: HttpClient, private errorHandling: ErrorHandlingService, private router: Router, private snackbarService: SnackbarService) {
    this.testId = Number(this.route.snapshot.paramMap.get('id'));
    this.test = { id: -1, name: '', questions_count: -1, question_set: -1, questions: [] };
  }

  ngOnInit(): void {
    this.getTest();
  }

  getTest(): void {
    this.http.get(this.apiUrl + '/api/test_details/' + this.testId + '/').subscribe({
      next: (data: any) => {
        this.test.id = data.id;
        this.test.name = data.name;
        this.test.question_set = data.question_set;
        this.test.questions_count = data.test_questions.length;
        this.test.questions = data.test_questions;
        for (const question of this.test.questions) {
          question.user_answer_correct = null;
          if (question.question_type === 'MULTIPLE') {
            question.user_answer = [];
            for (const answer of question.question_choices) {
              answer.checked = false;
            }
          } else {
            question.user_answer = '';
          }
        }
      },
      error: (error) => {
        this.errorHandling.handleError(error);
      }
    })
  }

  checkQuestionCorrect(type: string, question: TestQuestion) {
    switch (type) {
      case 'TEXT': {
        question.user_answer_correct = question.user_answer === question.question_choices[0].text;
        break;
      }
      case 'TF': {
        question.user_answer_correct = question.user_answer === question.is_true;
        break;
      }
      case 'SINGLE': {
        question.user_answer_correct = question.question_choices.filter((choice) => choice.id === question.user_answer)[0]?.is_correct || false
        break;
      }
      case 'MULTIPLE': {
        for (const answer of question.question_choices) {
          question.user_answer_correct = answer.is_correct === answer.checked;
          if (!question.user_answer_correct) {
            break;
          }
        }
      }
    }
  }

  getCorrectAnswers(question: any) {
    return question.question_choices.filter((answer: any) => answer.is_correct);
  }

  showTest(): void {
    this.router.navigateByUrl('/tests/' + this.testId);
  }

  submitTest(): void {
    for (const question of this.test.questions) {
      this.checkQuestionCorrect(question.question_type, question);
    }
  }
}
