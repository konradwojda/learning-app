import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { QuestionSet } from '../question-sets/question-set';
import { environment } from 'src/environments/environment';
import { SnackbarService } from '../snackbar.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-search-resources',
  templateUrl: './search-resources.component.html',
  styleUrls: ['./search-resources.component.css'],
  standalone: true,
  imports: [NgFor]
})
export class SearchResourcesComponent implements OnInit {

  resources: Array<QuestionSet> = [];
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private snackbarService: SnackbarService) {

  }

  ngOnInit(): void {
    this.http.get<Array<QuestionSet>>(this.apiUrl + '/api/question_sets/').subscribe({
      next: (data: Array<QuestionSet>) => {
        this.resources = data;
      },
      error: (error) => {
        this.snackbarService.showSnackbar(error.error.detail);
      }
    })
  }
}
