import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { OperationType } from '../entities/operation-type';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OperationTypeService {
  private apiUrl = `${environment.apiUrl}/api/operation-types`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<OperationType[]> {
    return this.http.get<OperationType[]>(this.apiUrl, { withCredentials: true });
  }

  getById(id: number): Observable<OperationType> {
    return this.http.get<OperationType>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  create(operationType: OperationType): Observable<OperationType> {
    return this.http.post<OperationType>(this.apiUrl, operationType, { withCredentials: true });
  }

  update(id: number, operationType: OperationType): Observable<OperationType> {
    return this.http.put<OperationType>(`${this.apiUrl}/${id}`, operationType, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true,  responseType: 'text' }).pipe(
      map(() => void 0), // Convert text response to void
      catchError((err) => {
        console.error('delete: Error:', err.status, err.message);
        throw err;
      })
    );
  }

  search(word: string): Observable<OperationType[]> {
    return this.http.get<OperationType[]>(`${this.apiUrl}/search?word=${word}`, { withCredentials: true });
  }
}