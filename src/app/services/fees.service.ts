import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fees } from '../entities/fees';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeesService {
  private apiUrl = `${environment.apiUrl}/api/fees`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Fees[]> {
    return this.http.get<Fees[]>(this.apiUrl);
  }

  getById(id: number): Observable<Fees> {
    return this.http.get<Fees>(`${this.apiUrl}/${id}`);
  }

  create(fees: Fees, options?: { headers?: any }): Observable<Fees> {
    return this.http.post<Fees>(this.apiUrl, fees, options);
  }

  update(id: number, fees: Fees, options?: { headers?: any }): Observable<Fees> {
    return this.http.put<Fees>(`${this.apiUrl}/${id}`, fees, options);
  }

  delete(id: number, options?: { headers?: any }): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, options);
  }

  search(word: string): Observable<Fees[]> {
    return this.http.get<Fees[]>(`${this.apiUrl}/search?word=${word}`);
  }
}