import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private apiUrl = `${environment.apiUrl}/api/auth`;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  // Add this method to get the current user ID
  getCurrentUserId(): string {
    return this.currentUserValue?.cusCode || '';
  }

  // Add this method to get the current user's wallet ID
  getCurrentUserWalletId(): string {
    return this.currentUserValue?.walletId || '';
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password })
      .pipe(map(user => {
        // Store user details in local storage
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout(): void {
    // Remove user from local storage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  existsByEmail(email: string) {
    return this.http.get<boolean>(`${this.apiUrl}/existsByEmail/${email}`);
  }

  existsByUsername(username: string) {
    return this.http.get<boolean>(`${this.apiUrl}/existsByUsername/${username}`);
  }

  existsByPhone(phone: string) {
    console.log(`${this.apiUrl}/existsByCusPhoneNbr/${phone}`);
    return this.http.get<boolean>(`${this.apiUrl}/existsByPhone/${phone}`);
  }

  getByEmail(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getByEmail/${email}`);
  }

  sendEmail(email: string, subject: string) {
    return this.http.post<string>(`${this.apiUrl}/sendEmail`, {
      cusMailAdress: email,
      subject: subject,
    });
  }

  verifyOTP(email: string, code: string) {
    return this.http.post<boolean>(`${this.apiUrl}/compareTOTP`, {
      cusMailAdress: email,
      code: code,
    });
  }

  resetPassword(cusCode: number, password: string) {
    return this.http.put<string>(`${this.apiUrl}/resetPassword/${cusCode}`, password);
  }
}