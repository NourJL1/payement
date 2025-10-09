import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Periodicity } from '../entities/periodicity';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PeriodicityService {
  private apiUrl = `${environment.apiUrl}/api/periodicities`;

  constructor(private http: HttpClient) {}

  private getHttpOptions(): { headers: HttpHeaders } {
    const role = localStorage.getItem('role') || 'ROLE_ADMIN';
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Roles': role
      })
    };
  }

  getAll(): Observable<Periodicity[]> {
    return this.http.get<Periodicity[]>(this.apiUrl, { withCredentials: true });
  }

  getById(id: number): Observable<Periodicity> {
    return this.http.get<Periodicity>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  create(periodicity: Periodicity, httpOptions?: { headers?: HttpHeaders }): Observable<Periodicity> {
    return this.http.post<Periodicity>(this.apiUrl, periodicity, { withCredentials: true });
  }

  update(id: number, periodicity: Periodicity, httpOptions?: { headers?: HttpHeaders }): Observable<Periodicity> {
    return this.http.put<Periodicity>(`${this.apiUrl}/${id}`, periodicity, { withCredentials: true });
  }

  delete(id: number, httpOptions?: { headers?: HttpHeaders }): Observable<void> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true, responseType: 'text' }).pipe(
      map(() => void 0),
      catchError((err) => {
        console.error('delete: Error:', err.status, err.message);
        throw err;
      })
    );
  }

  search(word: string): Observable<Periodicity[]> {
    return this.http.get<Periodicity[]>(`${this.apiUrl}/search?word=${word}`, { withCredentials: true });
  }
}