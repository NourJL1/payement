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
    return this.http.get<Fees[]>(this.apiUrl, { withCredentials: true });
  }

  getById(id: number): Observable<Fees> {
    return this.http.get<Fees>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  create(fees: Fees): Observable<Fees> {
    return this.http.post<Fees>(this.apiUrl, fees, { withCredentials: true });
  }

  update(id: number, fees: Fees): Observable<Fees> {
    return this.http.put<Fees>(`${this.apiUrl}/${id}`, fees, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  search(word: string): Observable<Fees[]> {
    return this.http.get<Fees[]>(`${this.apiUrl}/search?word=${word}`, { withCredentials: true });
  }
}