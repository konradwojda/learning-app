import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpXsrfTokenExtractor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CsrfTokenInterceptor implements HttpInterceptor {
  constructor(private tokenExtractor: HttpXsrfTokenExtractor) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const headerName = 'X-CSRFToken';
    const csrfToken = this.tokenExtractor.getToken() as string;
    if (csrfToken !== null && !req.headers.has(headerName)) {
      req = req.clone({ headers: req.headers.set(headerName, csrfToken) });
    }
    return next.handle(req);
  }
}
