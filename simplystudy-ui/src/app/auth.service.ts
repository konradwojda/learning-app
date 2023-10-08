import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoggedUser } from "./auth";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  logIn(username: string, password: string): Observable<any> {
    return this.http.post(
      this.apiUrl + '/auth/token/login/', { username, password }
    ) as Observable<any>;
  }

  setLoggedInUser(userData: LoggedUser): void {
    if (localStorage.getItem('userData') !== JSON.stringify(userData)) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }

  getUsername(): string | null {
    if (localStorage.getItem('userData')) {
      return JSON.parse(localStorage.getItem('userData') as string).username;
    }
    return null;
  }

  registerUser(username: string, password: string, re_password: string, email: string): Observable<any> {
    return this.http.post(this.apiUrl + '/auth/users/', { username, password, re_password, email });
  }

  logOut(): Observable<any> {
    return this.http.post(this.apiUrl + '/auth/token/logout/', {}) as Observable<any>;
  }
}