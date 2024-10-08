import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    RouterModule,
    MatMenuModule,
    NgIf,
    NgFor,
    TranslateModule,
  ],
  standalone: true,
})
export class NavigationComponent
  implements OnDestroy, OnInit, AfterViewChecked {
  mobileQuery: MediaQueryList;
  isAuthenticated = false;
  username = '';
  languages: string[];
  selectedLang!: string;

  private mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private authService: AuthService,
    private router: Router,
    private languageService: LanguageService,
  ) {
    this.languages = this.languageService.getAllLanguages();
    this.languageService.getcurrentLanguage().subscribe((language) => {
      this.selectedLang = language;
    });
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
  }

  ngOnInit(): void {
    this.authService.isAuthenticated$().subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
    });
    this.authService.getUsername$().subscribe((username) => {
      this.username = username;
    });
    this.authService.setAuthenticated();
  }

  logOut(): void {
    this.authService.logOut().subscribe({
      error: (error) => {
        console.log(error);
        localStorage.removeItem('userData');
        this.authService.setUsername('');
        this.authService.setIsAuthenticated(false);
        this.router.navigateByUrl('');
      },
      complete: () => {
        localStorage.removeItem('userData');
        this.authService.setUsername('');
        this.authService.setIsAuthenticated(false);
        this.router.navigateByUrl('');
      },
    });
  }

  changeLang(language: string) {
    this.languageService.changeLanguage(language);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
  }

  ngAfterViewChecked() {
    window.dispatchEvent(new Event('resize'));
  }
}
