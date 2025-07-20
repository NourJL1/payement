import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FeeRule } from '../entities/fee-rule';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeeRuleService {
  private apiUrl = `${environment.apiUrl}/api/fee-rule`;

  constructor(private http: HttpClient) {}

  private getHttpOptions(): { headers: HttpHeaders } {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role') || 'CUSTOMER';
    const rolesHeader = `ROLE_${role.toUpperCase()}`;

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Roles': rolesHeader
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return { headers };
  }

  getAll(): Observable<FeeRule[]> {
    return this.http.get<FeeRule[]>(this.apiUrl, this.getHttpOptions()).pipe(
      catchError(error => {
        console.error('getAll: Error:', error.status, error.message);
        return throwError(() => new Error('Failed to fetch fee rules'));
      })
    );
  }

  getById(id: number): Observable<FeeRule> {
    return this.http.get<FeeRule>(`${this.apiUrl}/${id}`, this.getHttpOptions()).pipe(
      catchError(error => {
        console.error('getById: Error:', error.status, error.message);
        return throwError(() => new Error('Failed to fetch fee rule'));
      })
    );
  }

  create(feeRule: FeeRule, httpOptions: { headers: HttpHeaders } = this.getHttpOptions()): Observable<FeeRule> {
    return this.http.post<FeeRule>(this.apiUrl, feeRule, httpOptions).pipe(
      catchError(error => {
        console.error('create: Error:', error.status, error.message);
        return throwError(() => new Error('Failed to create fee rule'));
      })
    );
  }

  update(id: number, feeRule: FeeRule, httpOptions: { headers: HttpHeaders } = this.getHttpOptions()): Observable<FeeRule> {
    return this.http.put<FeeRule>(`${this.apiUrl}/${id}`, feeRule, httpOptions).pipe(
      catchError(error => {
        console.error('update: Error:', error.status, error.message);
        return throwError(() => new Error('Failed to update fee rule'));
      })
    );
  }

  delete(id: number, httpOptions: { headers: HttpHeaders } = this.getHttpOptions()): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, httpOptions).pipe(
      catchError(error => {
        console.error('delete: Error:', error.status, error.message);
        return throwError(() => new Error('Failed to delete fee rule'));
      })
    );
  }

  search(word: string): Observable<FeeRule[]> {
    return this.http.get<FeeRule[]>(`${this.apiUrl}/search?word=${word}`, this.getHttpOptions()).pipe(
      catchError(error => {
        console.error('search: Error:', error.status, error.message);
        return throwError(() => new Error('Failed to search fee rules'));
      })
    );
  }
}