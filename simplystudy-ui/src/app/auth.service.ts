import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpXsrfTokenExtractor } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoggedUser } from "./auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private cookieExtractor: HttpXsrfTokenExtractor) { }

  logIn(username: string, password: string): Observable<any> {
    let xsrf = this.cookieExtractor.getToken() as string;
    let headers = new HttpHeaders().set('X-CSRFToken', xsrf);
    return this.http.post(
      'http://127.0.0.1:8000/auth/token/login/', { username, password }, { 'headers': headers }
    ) as Observable<any>;
  }

  setLoggedInUser(userData: LoggedUser): void {
    if (localStorage.getItem('userData') !== JSON.stringify(userData)) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }
}