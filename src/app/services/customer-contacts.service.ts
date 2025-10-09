import { Injectable } from '@angular/core';
import { CustomerContacts } from '../entities/customer-contacts';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerContactsService {

private apiUrl = `${environment.apiUrl}/api/customer-contacts`;

  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getAll(): Observable<CustomerContacts[]> {
    return this.http.get<CustomerContacts[]>(this.apiUrl, { withCredentials: true });
  }

  getById(id: number): Observable<CustomerContacts> {
    return this.http.get<CustomerContacts>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  create(contact: CustomerContacts): Observable<CustomerContacts> {
    return this.http.post<CustomerContacts>(this.apiUrl, contact, { withCredentials: true });
  }

  update(id: number, contact: CustomerContacts): Observable<CustomerContacts> {
    return this.http.put<CustomerContacts>(`${this.apiUrl}/${id}`, contact, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  search(word: string): Observable<CustomerContacts[]> {
    return this.http.get<CustomerContacts[]>(`${this.apiUrl}/search?word=${word}`, { withCredentials: true });
  }}
