import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuestionSet } from '../question-sets/question-set';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
import { ErrorHandlingService } from '../error-handling.service';
import { Test } from './test';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-tests',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, TranslateModule, NgFor, MatIconModule, MatRippleModule, MatTooltipModule],
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css']
})
export class TestsComponent implements OnInit {
  questionSet: QuestionSet;
  tests: Test[] = [];
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService, private route: ActivatedRoute, private errorHandling: ErrorHandlingService) {
    this.questionSet = {
      id: '',
      name: '',
      description: '',
      course: null,
      questions: '',
      owner: '',
      is_private: null,
    };
  }

  ngOnInit(): void {
    this.getQuestionSet();
    this.getTests();
  }

  getQuestionSet(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http
      .get<QuestionSet>(this.apiUrl + '/api/question_sets/' + id + '/')
      .subscribe({
        next: (data: QuestionSet) => {
          this.questionSet = {
            id: data.id,
            name: data.name,
            description: data.description,
            course: data.course,
            questions: data.questions,
            owner: data.owner,
            is_private: data.is_private,
          };
        },
        error: (error) => {
          this.errorHandling.handleError(error);
        },
      });
  }

  getTests(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http.get<Test[]>(this.apiUrl + '/api/tests/?question_set=' + id).subscribe({
      next: (data: Test[]) => {
        this.tests = data
      }
    })
  }

}
