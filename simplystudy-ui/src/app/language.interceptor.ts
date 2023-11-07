import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LanguageService } from './language.service';

@Injectable()
export class LanguageInterceptor implements HttpInterceptor {
  selectedLang = '';

  constructor(private languageService: LanguageService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    this.languageService
      .getcurrentLanguage()
      .subscribe((language) => (this.selectedLang = language));
    if (this.selectedLang) {
      request = request.clone({
        headers: request.headers.set(
          'Accept-Language',
          this.selectedLang + '-' + this.selectedLang,
        ),
      });
    }
    return next.handle(request);
  }
}
