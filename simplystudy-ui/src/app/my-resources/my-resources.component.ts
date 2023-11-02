import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserResource } from '../search-resources/user-resource';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { ErrorHandlingService } from '../error-handling.service';
import { QuestionSet } from '../question-sets/question-set';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-my-resources',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatRippleModule, MatTabsModule],
  templateUrl: './my-resources.component.html',
  styleUrls: ['./my-resources.component.css']
})
export class MyResourcesComponent implements OnInit {

  resources: UserResource[] = [];
  question_sets: QuestionSet[] = [];
  private apiUrl = environment.apiUrl;

  constructor(private router: Router, private http: HttpClient, private authService: AuthService, private errorHandling: ErrorHandlingService) { }

  private getUserResources(): void {
    let username = this.authService.getUsername();
    this.http.get<UserResource[]>(this.apiUrl + '/api/user_resources/?username=' + username).subscribe({
      next: (data: UserResource[]) => {
        this.resources = data;
      },
      error: (error) => {
        this.errorHandling.handleError(error);
      }
    })
  }

  private getUserQuestionSets(): void {
    let username = this.authService.getUsername();
    this.http.get<Array<QuestionSet>>(this.apiUrl + '/api/question_sets/?username=' + username).subscribe({
      next: (data: Array<QuestionSet>) => {
        this.question_sets = data;
      },
      error: (error) => {
        this.errorHandling.handleError(error);
      }
    });
  }

  ngOnInit(): void {
    this.getUserResources();
    this.getUserQuestionSets();
  }

  public onCardClick(event: any) {
    this.router.navigateByUrl('/question_sets/' + event.id);
  }

}
