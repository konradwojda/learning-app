import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionSet } from '../question-sets/question-set';
import { AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';
import { SnackbarService } from '../snackbar.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [MatGridListModule, NgFor, MatCardModule]
})
export class DashboardComponent implements OnInit {

  questionSets: Array<QuestionSet> = [];
  private apiUrl = environment.apiUrl;

  constructor(private route: ActivatedRoute, private http: HttpClient, private authService: AuthService, private snackbarService: SnackbarService) {
  }

  ngOnInit(): void {
    let username = this.authService.getUsername();
    this.http.get<Array<QuestionSet>>(this.apiUrl + '/api/question_sets/?username=' + username).subscribe({
      next: (data: Array<QuestionSet>) => this.questionSets = data,
      error: (error) => {
        this.snackbarService.showSnackbar(error.error.detail);
      }
    });
  };
}
