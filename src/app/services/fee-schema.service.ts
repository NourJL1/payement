import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeeSchema } from '../entities/fee-schema';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeeSchemaService {
  private apiUrl = `${environment.apiUrl}/api/fee-schemas`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<FeeSchema[]> {
    return this.http.get<FeeSchema[]>(this.apiUrl, { withCredentials: true });
  }

  getById(id: number): Observable<FeeSchema> {
    return this.http.get<FeeSchema>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  create(feeSchema: FeeSchema): Observable<FeeSchema> {
    return this.http.post<FeeSchema>(this.apiUrl, feeSchema, { withCredentials: true });
  }

  update(id: number, feeSchema: FeeSchema): Observable<FeeSchema> {
    return this.http.put<FeeSchema>(`${this.apiUrl}/${id}`, feeSchema, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  search(word: string): Observable<FeeSchema[]> {
    return this.http.get<FeeSchema[]>(`${this.apiUrl}/search?word=${word}`, { withCredentials: true });
  }
}