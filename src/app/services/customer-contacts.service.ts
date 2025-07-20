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
    return this.http.get<CustomerContacts[]>(this.apiUrl);
  }

  getById(id: number): Observable<CustomerContacts> {
    return this.http.get<CustomerContacts>(`${this.apiUrl}/${id}`);
  }

  create(contact: CustomerContacts): Observable<CustomerContacts> {
    return this.http.post<CustomerContacts>(this.apiUrl, contact, this.httpOptions);
  }

  update(id: number, contact: CustomerContacts): Observable<CustomerContacts> {
    return this.http.put<CustomerContacts>(`${this.apiUrl}/${id}`, contact, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  search(word: string): Observable<CustomerContacts[]> {
    return this.http.get<CustomerContacts[]>(`${this.apiUrl}/search?word=${word}`);
  }}
