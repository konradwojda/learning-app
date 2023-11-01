import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { QuestionSet } from '../question-sets/question-set';
import { environment } from 'src/environments/environment';
import { SnackbarService } from '../snackbar.service';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-search-resources',
  templateUrl: './search-resources.component.html',
  styleUrls: ['./search-resources.component.css'],
  standalone: true,
  imports: [NgFor, MatCardModule, MatRippleModule, NgIf, MatPaginatorModule, MatInputModule, FormsModule, MatButtonModule]
})
export class SearchResourcesComponent implements OnInit {

  resources: Array<QuestionSet> = [];
  private apiUrl = environment.apiUrl;

  items_count: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions: number[] = [10, 20, 50, 75];

  searchText: string = '';
  searchUrl: string = ''


  constructor(private http: HttpClient, private snackbarService: SnackbarService, private router: Router) {

  }

  getResources(): void {
    this.http.get(this.apiUrl + '/api/public_question_sets/?page_size=' + this.pageSize + this.searchUrl).subscribe({
      next: (data: any) => {
        this.items_count = data.count
        this.resources = data.results;
      },
      error: (error) => {
        this.snackbarService.showError(error);
      }
    })
  }

  ngOnInit(): void {
    this.getResources();
  }

  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    let query_idx = e.pageIndex + 1;
    this.http.get(this.apiUrl + '/api/public_question_sets/?page=' + query_idx + '&' + 'page_size=' + this.pageSize + this.searchUrl).subscribe({
      next: (data: any) => {
        this.resources = data.results;
      }
    })
  }

  public onCardClick(event: any) {
    this.router.navigateByUrl('/question_sets/' + event.id);
  }

  searchResources(): void {
    if (this.searchText !== '') {
      this.searchUrl = '&search=' + this.searchText;
      this.getResources();
    }
    else {
      this.searchUrl = '';
      this.getResources();
    }
  }
}
