import { Injectable } from '@angular/core';
import { CustomerStatus } from '../entities/customer-status';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerStatusService {

 private apiUrl = `${environment.apiUrl}/api/customer-status`;

  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getAll(): Observable<CustomerStatus[]> {
    return this.http.get<CustomerStatus[]>(this.apiUrl, { withCredentials: true });
  }

  getById(id: number): Observable<CustomerStatus> {
    return this.http.get<CustomerStatus>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  create(status: CustomerStatus): Observable<CustomerStatus> {
    return this.http.post<CustomerStatus>(this.apiUrl, status, { withCredentials: true });
  }

  update(id: number, status: CustomerStatus): Observable<CustomerStatus> {
    return this.http.put<CustomerStatus>(`${this.apiUrl}/${id}`, status, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  search(word: string): Observable<CustomerStatus[]> {
    return this.http.get<CustomerStatus[]>(`${this.apiUrl}/search?word=${word}`, { withCredentials: true });
  }}
