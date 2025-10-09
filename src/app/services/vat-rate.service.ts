import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { VatRate } from '../entities/vat-rate';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VatRateService {
  private apiUrl = `${environment.apiUrl}/api/vat-rates`;

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

  getAll(): Observable<VatRate[]> {
    return this.http.get<VatRate[]>(this.apiUrl, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('getAll: Error:', error.status, error.message);
        return throwError(() => new Error('Failed to fetch VAT rates'));
      })
    );
  }

  getByCode(vatCode: number, vatActive: number = 1): Observable<VatRate> {
    return this.http.get<VatRate>(`${this.apiUrl}/${vatCode}?vatActive=${vatActive}`, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('getByCode: Error:', error.status, error.message);
        return throwError(() => new Error('Failed to fetch VAT rate'));
      })
    );
  }

  create(vatRate: VatRate): Observable<VatRate> {
    return this.http.post<VatRate>(this.apiUrl, vatRate, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('create: Error:', error.status, error.message);
        return throwError(() => new Error('Failed to create VAT rate'));
      })
    );
  }

  update(vatCode: number, vatRate: VatRate): Observable<VatRate> {
    return this.http.put<VatRate>(`${this.apiUrl}/${vatCode}`, vatRate, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('update: Error:', error.status, error.message);
        return throwError(() => new Error('Failed to update VAT rate'));
      })
    );
  }

  delete(vatCode: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${vatCode}`, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('delete: Error:', error.status, error.message);
        return throwError(() => new Error('Failed to delete VAT rate'));
      })
    );
  }
}