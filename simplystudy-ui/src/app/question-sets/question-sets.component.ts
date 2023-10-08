import { Component, OnInit } from '@angular/core';
import { QuestionSet } from './question-set';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-question-sets',
  templateUrl: './question-sets.component.html',
  styleUrls: ['./question-sets.component.css'],
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatListModule, NgFor, MatIconModule]
})
export class QuestionSetsComponent implements OnInit {
  questionSet: QuestionSet;
  private apiUrl = environment.apiUrl;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.questionSet = {
      name: '',
      description: '',
      course: '',
      questions: '',
      owner: ''
    }
  }

  ngOnInit(): void {
    this.getQuestionSet();
  }
  getQuestionSet(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http.get<QuestionSet>(this.apiUrl + '/api/question_sets/' + id + '/').subscribe((data: QuestionSet) => this.questionSet = {
      name: data.name,
      description: data.description,
      course: data.course,
      questions: data.questions,
      owner: data.owner,
    })
  }
}
