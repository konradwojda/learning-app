import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  standalone: true,
  imports: [MatButtonModule, RouterModule, TranslateModule],
})
export class LandingPageComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/dashboard');
    }
  }
}
