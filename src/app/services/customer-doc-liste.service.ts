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
    return this.http.get<CustomerDocListe[]>(this.apiUrl);
  }

  getById(id: number): Observable<CustomerDocListe> {
    return this.http.get<CustomerDocListe>(`${this.apiUrl}/${id}`);
  }

  create(doc: CustomerDocListe): Observable<CustomerDocListe> {
    return this.http.post<CustomerDocListe>(this.apiUrl, doc, this.httpOptions);
  }

  update(id: number, doc: CustomerDocListe): Observable<CustomerDocListe> {
    return this.http.put<CustomerDocListe>(`${this.apiUrl}/${id}`, doc, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  search(word: string): Observable<CustomerDocListe[]> {
    return this.http.get<CustomerDocListe[]>(`${this.apiUrl}/search?word=${word}`);
  }}
