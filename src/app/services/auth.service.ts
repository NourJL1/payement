import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  
  private apiUrl = `${environment.apiUrl}/api/auth`;

  
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
  }

  getByEmail(email: string): Observable<any> {
      return this.http.get(
        `${this.apiUrl}/getByEmail/${email}`/* ,
        this.getHttpOptions() */
      );
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
