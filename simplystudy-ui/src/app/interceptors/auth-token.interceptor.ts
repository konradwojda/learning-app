import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.auth_token) {
      request = request.clone({
        headers: request.headers.set(
          'Authorization',
          'Token ' + userData.auth_token,
        ),
      });
    }
    return next.handle(request);
  }
}
