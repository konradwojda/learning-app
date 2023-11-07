import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { QuestionSet } from '../question-sets/question-set';
import { AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';
import { SnackbarService } from '../snackbar.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { ErrorHandlingService } from '../error-handling.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [MatGridListModule, NgFor, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatListModule, MatRippleModule, FormsModule, RouterModule, TranslateModule]
})
export class DashboardComponent implements OnInit {

  questionSets: Array<QuestionSet> = [];
  filteredQuestionSets: Array<QuestionSet> = [];
  filterText = '';
  private apiUrl = environment.apiUrl;

  constructor(private router: Router, private http: HttpClient, private authService: AuthService, private snackbarService: SnackbarService, private errorHandling: ErrorHandlingService) {
  }

  applyFilter() {
    this.filteredQuestionSets = this.filterQuestionSetsByName(this.filterText);
  }

  private filterQuestionSetsByName(filterText: string): Array<QuestionSet> {
    return this.questionSets.filter((questionSet) =>
      questionSet.name.toLowerCase().includes(filterText.toLowerCase())
    );
  }

  ngOnInit(): void {
    const username = this.authService.getUsername();
    this.http.get<Array<QuestionSet>>(this.apiUrl + '/api/question_sets/?username=' + username).subscribe({
      next: (data: Array<QuestionSet>) => {
        this.questionSets = data;
        this.filteredQuestionSets = data;
      },
      error: (error) => {
        this.errorHandling.handleError(error);
      }
    });
  }

  public onCardClick(event: any) {
    this.router.navigateByUrl('/question_sets/' + event.id);
  }
}
