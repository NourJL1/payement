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

  getAll(options?: { headers: HttpHeaders }): Observable<FeeSchema[]> {
    return this.http.get<FeeSchema[]>(this.apiUrl, options);
  }

  getById(id: number, options?: { headers: HttpHeaders }): Observable<FeeSchema> {
    return this.http.get<FeeSchema>(`${this.apiUrl}/${id}`, options);
  }

  create(feeSchema: FeeSchema, options?: { headers: HttpHeaders }): Observable<FeeSchema> {
    return this.http.post<FeeSchema>(this.apiUrl, feeSchema, options);
  }

  update(id: number, feeSchema: FeeSchema, options?: { headers: HttpHeaders }): Observable<FeeSchema> {
    return this.http.put<FeeSchema>(`${this.apiUrl}/${id}`, feeSchema, options);
  }

  delete(id: number, options?: { headers: HttpHeaders }): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, options);
  }

  search(word: string, options?: { headers: HttpHeaders }): Observable<FeeSchema[]> {
    return this.http.get<FeeSchema[]>(`${this.apiUrl}/search?word=${word}`, options);
  }
}