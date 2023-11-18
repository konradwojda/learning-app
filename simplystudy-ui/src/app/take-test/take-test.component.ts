import { Component, OnInit } from '@angular/core';
import { Test } from '../tests/test';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../error-handling.service';
import { SnackbarService } from '../snackbar.service';
import { environment } from 'src/environments/environment';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { NgFor, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-take-test',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, TranslateModule, NgFor, NgIf, MatFormFieldModule, ReactiveFormsModule, FormsModule, MatInputModule, MatRadioModule, MatCheckboxModule],
  templateUrl: './take-test.component.html',
  styleUrls: ['./take-test.component.css']
})
export class TakeTestComponent implements OnInit{
  test: Test;
  testId: number;
  userAnswers: any[] = [];
  private apiUrl = environment.apiUrl;

  constructor(private route: ActivatedRoute, private http: HttpClient, private errorHandling: ErrorHandlingService, private router: Router, private snackbarService: SnackbarService) {
    this.testId = Number(this.route.snapshot.paramMap.get('id'));
    this.test = {id: -1, name: '', questions_count: -1, question_set: -1, questions: []};
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
        for(const question of data.test_questions) {
          const question_answers = question.question_choices.map((answer: any) => {
            return {id: answer.id, is_correct: false, text: answer.text, user_answer: ''}
          })
          this.userAnswers.push({id: question.id, answers: question_answers, is_true: null, text: question.question, type: question.question_type});
        }
        console.log(this.userAnswers);
      },
      error: (error) => {
        this.errorHandling.handleError(error);
      }
    })
  }

  submitTest(): void {
    console.log(this.userAnswers);
  }


}
