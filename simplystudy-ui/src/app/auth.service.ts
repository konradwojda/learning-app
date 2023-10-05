import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoggedUser } from "./auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  logIn(username: string, password: string): Observable<any> {
    return this.http.post(
      'http://127.0.0.1:8000/auth/token/login/', { username, password }
    ) as Observable<any>;
  }

  setLoggedInUser(userData: LoggedUser): void {
    if (localStorage.getItem('userData') !== JSON.stringify(userData)) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }

  registerUser(username: string, password: string, re_password: string, email: string): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/auth/users/', { username, password, re_password, email });
  }
}