import { Component, Input, OnInit } from '@angular/core';
import { QuestionSet } from './question-set';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-question-sets',
  templateUrl: './question-sets.component.html',
  styleUrls: ['./question-sets.component.css'],
  standalone: true,
})
export class QuestionSetsComponent implements OnInit {
  @Input() questionSet?: QuestionSet;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.getQuestionSet();
  }
  getQuestionSet(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http.get<QuestionSet>('http://127.0.0.1:8000/api/question_sets/' + id + '/').subscribe((data: QuestionSet) => this.questionSet = {
      name: data.name,
      description: data.description,
      course: data.course,
      questions: data.questions,
      owner: data.owner
    })
  }
}
