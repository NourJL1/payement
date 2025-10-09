import { Injectable } from '@angular/core';
import { CustomerDocListe } from '../entities/customer-doc-liste';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerDocListeService {

 private apiUrl = `${environment.apiUrl}/api/customer-doc-liste`;

  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getAll(): Observable<CustomerDocListe[]> {
    return this.http.get<CustomerDocListe[]>(this.apiUrl, { withCredentials: true });
  }

  getById(id: number): Observable<CustomerDocListe> {
    return this.http.get<CustomerDocListe>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  create(doc: CustomerDocListe): Observable<CustomerDocListe> {
    return this.http.post<CustomerDocListe>(this.apiUrl, doc, { withCredentials: true });
  }

  update(id: number, doc: CustomerDocListe): Observable<CustomerDocListe> {
    return this.http.put<CustomerDocListe>(`${this.apiUrl}/${id}`, doc, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  search(word: string): Observable<CustomerDocListe[]> {
    return this.http.get<CustomerDocListe[]>(`${this.apiUrl}/search?word=${word}`, { withCredentials: true });
  }}
