import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WalletType } from '../entities/wallet-type';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WalletTypeService {
  private apiUrl = `${environment.apiUrl}/api/wallet-types`;

  constructor(private http: HttpClient) {}

  private getHttpOptions(includeAuth: boolean = false): { headers: HttpHeaders } {
    const role = localStorage.getItem('role') || 'ROLE_ADMIN';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(includeAuth ? { 'X-Roles': role } : {})
    });
    return { headers };
  }

  getAll(httpOptions: { headers: HttpHeaders } = this.getHttpOptions()): Observable<WalletType[]> {
    return this.http.get<WalletType[]>(this.apiUrl, httpOptions).pipe(
      catchError(error => {
        console.error('WalletTypeService: getAll - Error:', error, 'Response:', error.error, 'Status:', error.status);
        return throwError(() => new Error(`Failed to fetch wallet types: ${error.status} ${error.statusText} - ${error.error?.message || 'No response body'}`));
      })
    );
  }

  getById(id: number, httpOptions: { headers: HttpHeaders } = this.getHttpOptions()): Observable<WalletType> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<WalletType>(url, httpOptions).pipe(
      catchError(error => {
        console.error('WalletTypeService: getById - Error:', error, 'Response:', error.error, 'Status:', error.status);
        return throwError(() => new Error(`Failed to fetch wallet type ${id}: ${error.status} ${error.statusText} - ${error.error?.message || 'No response body'}`));
      })
    );
  }

  create(walletType: WalletType, httpOptions: { headers: HttpHeaders } = this.getHttpOptions()): Observable<WalletType> {
    return this.http.post<WalletType>(this.apiUrl, walletType, httpOptions).pipe(
      catchError(error => {
        console.error('WalletTypeService: create - Error:', error, 'Response:', error.error, 'Status:', error.status);
        return throwError(() => new Error(`Failed to create wallet type: ${error.status} ${error.statusText} - ${error.error?.message || 'No response body'}`));
      })
    );
  }

  update(id: number, walletType: WalletType, httpOptions: { headers: HttpHeaders } = this.getHttpOptions()): Observable<WalletType> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<WalletType>(url, walletType, httpOptions).pipe(
      catchError(error => {
        console.error('WalletTypeService: update - Error:', error, 'Response:', error.error, 'Status:', error.status);
        return throwError(() => new Error(`Failed to update wallet type ${id}: ${error.status} ${error.statusText} - ${error.error?.message || 'No response body'}`));
      })
    );
  }

  delete(id: number, httpOptions: { headers: HttpHeaders } = this.getHttpOptions()): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url, httpOptions).pipe(
      catchError(error => {
        console.error('WalletTypeService: delete - Error:', error, 'Response:', error.error, 'Status:', error.status);
        return throwError(() => new Error(`Failed to delete wallet type ${id}: ${error.status} ${error.statusText} - ${error.error?.message || 'No response body'}`));
      })
    );
  }

  search(word: string, httpOptions: { headers: HttpHeaders } = this.getHttpOptions()): Observable<WalletType[]> {
    const url = `${this.apiUrl}/search?word=${word}`;
    return this.http.get<WalletType[]>(url, httpOptions).pipe(
      catchError(error => {
        console.error('WalletTypeService: search - Error:', error, 'Response:', error.error, 'Status:', error.status);
        return throwError(() => new Error(`Failed to search wallet types: ${error.status} ${error.statusText} - ${error.error?.message || 'No response body'}`));
      })
    );
  }
}