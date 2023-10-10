import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router'
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule, RouterModule, MatMenuModule, NgIf],
  standalone: true,
})
export class NavigationComponent implements OnDestroy, OnInit {
  mobileQuery: MediaQueryList;
  isAuthenticated: boolean = false;
  username: string = '';

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private authService: AuthService, private router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  };

  ngOnInit(): void {
    this.authService.isAuthenticated$().subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
    });
    this.authService.getUsername$().subscribe((username) => {
      this.username = username;
    })
    this.authService.setAuthenticated();
  }

  logOut(): void {
    this.authService.logOut().subscribe({
      next: (data) => {
        localStorage.removeItem('userData');
        this.authService.setUsername('');
        this.authService.setIsAuthenticated(false);
        this.router.navigateByUrl('');
      },
      error: (error) => {
        console.log(error);
      }
    }
    );
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener)
  }
}
