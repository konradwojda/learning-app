import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { LoggedUser } from "./auth";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private usernameSubject = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) { }

  logIn(username: string, password: string): Observable<any> {
    return this.http.post(
      this.apiUrl + '/auth/token/login/', { username, password }
    ) as Observable<any>;
  }

  setAuthenticated(): void {
    if (this.isLoggedIn()) {
      this.setUsername(this.getUsername());
      this.setIsAuthenticated(true);
    }
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('userData') ? true : false;
  }

  setUsername(username: string): void {
    this.usernameSubject.next(username);
  }

  setIsAuthenticated(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getUsername$(): Observable<string> {
    return this.usernameSubject.asObservable();
  }

  setLoggedInUser(userData: LoggedUser): void {
    if (localStorage.getItem('userData') !== JSON.stringify(userData)) {
      localStorage.setItem('userData', JSON.stringify(userData));
      this.setUsername(this.getUsername());
    }
  }

  getUsername(): string {
    if (this.isLoggedIn()) {
      return JSON.parse(localStorage.getItem('userData') as string).username;
    }
    return '';
  }

  registerUser(username: string, password: string, re_password: string, email: string): Observable<any> {
    return this.http.post(this.apiUrl + '/auth/users/', { username, password, re_password, email });
  }

  logOut(): Observable<any> {
    return this.http.post(this.apiUrl + '/auth/token/logout/', {}) as Observable<any>;
  }

  activate(uid: string, token: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/auth/users/activation/', { uid, token });
  }

  resendActivation(email: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/auth/users/resend_activation/', { email });
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/auth/users/reset_password/', { email });
  }

  resetPasswordConfirmation(new_password: string, re_new_password: string, uid: string, token: string): Observable<any> {
    return this.http.post(this.apiUrl + '/auth/users/reset_password_confirm/', { uid, token, new_password, re_new_password });
  }
}