import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WalletStatus } from '../entities/wallet-status';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WalletStatusService {
  private apiUrl = `${environment.apiUrl}/api/wallet-status`;

  constructor(private http: HttpClient) {}

  private getHttpOptions(includeAuth: boolean = false): { headers: HttpHeaders } {
    const role = localStorage.getItem('role') || 'ROLE_ADMIN';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(includeAuth ? { 'X-Roles': role } : {})
    });
    return { headers };
  }

  getAll(): Observable<WalletStatus[]> {
    return this.http.get<WalletStatus[]>(this.apiUrl, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('WalletStatusService: getAll - Error:', error, 'Response:', error.error, 'Status:', error.status);
        return throwError(() => new Error(`Failed to fetch wallet statuses: ${error.status} ${error.statusText} - ${error.error?.message || 'No response body'}`));
      })
    );
  }

  getById(id: number): Observable<WalletStatus> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<WalletStatus>(url, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('WalletStatusService: getById - Error:', error, 'Response:', error.error, 'Status:', error.status);
        return throwError(() => new Error(`Failed to fetch wallet status ${id}: ${error.status} ${error.statusText} - ${error.error?.message || 'No response body'}`));
      })
    );
  }

  create(walletStatus: WalletStatus): Observable<WalletStatus> {
    return this.http.post<WalletStatus>(this.apiUrl, walletStatus, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('WalletStatusService: create - Error:', error, 'Response:', error.error, 'Status:', error.status);
        return throwError(() => new Error(`Failed to create wallet status: ${error.status} ${error.statusText} - ${error.error?.message || 'No response body'}`));
      })
    );
  }

  update(id: number, walletStatus: WalletStatus): Observable<WalletStatus> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<WalletStatus>(url, walletStatus, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('WalletStatusService: update - Error:', error, 'Response:', error.error, 'Status:', error.status);
        return throwError(() => new Error(`Failed to update wallet status ${id}: ${error.status} ${error.statusText} - ${error.error?.message || 'No response body'}`));
      })
    );
  }

  delete(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('WalletStatusService: delete - Error:', error, 'Response:', error.error, 'Status:', error.status);
        return throwError(() => new Error(`Failed to delete wallet status ${id}: ${error.status} ${error.statusText} - ${error.error?.message || 'No response body'}`));
      })
    );
  }

  search(word: string): Observable<WalletStatus[]> {
    const url = `${this.apiUrl}/search?word=${word}`;
    return this.http.get<WalletStatus[]>(url, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('WalletStatusService: search - Error:', error, 'Response:', error.error, 'Status:', error.status);
        return throwError(() => new Error(`Failed to search wallet statuses: ${error.status} ${error.statusText} - ${error.error?.message || 'No response body'}`));
      })
    );
  }
}