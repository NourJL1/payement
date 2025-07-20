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
    return this.http.get<OperationType[]>(this.apiUrl);
  }

  getById(id: number): Observable<OperationType> {
    return this.http.get<OperationType>(`${this.apiUrl}/${id}`);
  }

  create(operationType: OperationType, httpOptions?: { headers?: HttpHeaders }): Observable<OperationType> {
    return this.http.post<OperationType>(this.apiUrl, operationType, httpOptions || { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  update(id: number, operationType: OperationType, httpOptions?: { headers?: HttpHeaders }): Observable<OperationType> {
    return this.http.put<OperationType>(`${this.apiUrl}/${id}`, operationType, httpOptions);
  }

  delete(id: number, httpOptions?: { headers?: HttpHeaders }): Observable<void> {
    return this.http.delete(`${this.apiUrl}/${id}`, { ...httpOptions, responseType: 'text' }).pipe(
      map(() => void 0), // Convert text response to void
      catchError((err) => {
        console.error('delete: Error:', err.status, err.message);
        throw err;
      })
    );
  }

  search(word: string): Observable<OperationType[]> {
    return this.http.get<OperationType[]>(`${this.apiUrl}/search?word=${word}`);
  }
}