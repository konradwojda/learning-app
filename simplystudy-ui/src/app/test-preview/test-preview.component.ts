import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Test } from '../tests/test';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorHandlingService } from '../error-handling.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';

@Component({
  selector: 'app-test-preview',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, TranslateModule, MatIconModule, NgFor, NgIf, NgSwitchCase],
  templateUrl: './test-preview.component.html',
  styleUrls: ['./test-preview.component.css']
})
export class TestPreviewComponent implements OnInit {

  testId: number;
  test: Test;
  private apiUrl = environment.apiUrl;

  constructor(private route: ActivatedRoute, private http: HttpClient, private errorHandling: ErrorHandlingService) {
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
        console.log(this.test);
      },
      error: (error) => {
        this.errorHandling.handleError(error);
      }
    })
  }

}
