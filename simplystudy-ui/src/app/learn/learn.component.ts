import { Component, OnInit, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionsStepperComponent } from '../questions-stepper/questions-stepper.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { MatCardModule } from '@angular/material/card';
import { QuestionSet } from '../question-sets/question-set';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { ErrorHandlingService } from '../error-handling.service';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [
    CommonModule,
    forwardRef(() => QuestionsStepperComponent),
    CdkStepperModule,
    MatCardModule,
    MatButtonModule,
    MatRippleModule,
    TranslateModule,
  ],
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.css'],
})
export class LearnComponent implements OnInit {
  questionSet: QuestionSet;
  answerCardVisible: boolean[] = [];
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private authService: AuthService,
    private errorHandling: ErrorHandlingService,
    private router: Router,
  ) {
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

  toggleAnswerCard(index: number): void {
    this.answerCardVisible[index] = !this.answerCardVisible[index];
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

  ngOnInit(): void {
    this.getQuestionSet();
  }

  showSet(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.router.navigateByUrl('/question_sets/' + id);
  }
}
