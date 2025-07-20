import { Injectable } from '@angular/core';
import { CustomerIdentity } from '../entities/customer-identity';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerIdentityService {

 private apiUrl = `${environment.apiUrl}/api/customer-identity`;

  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getAll(): Observable<CustomerIdentity[]> {
    return this.http.get<CustomerIdentity[]>(this.apiUrl);
  }

  getById(id: number): Observable<CustomerIdentity> {
    return this.http.get<CustomerIdentity>(`${this.apiUrl}/${id}`);
  }

  existsByCidNum(num:  string){
    return this.http.get<boolean>(`${this.apiUrl}/existsByCidNum/${num}`)
  }

  create(customerIdentity: CustomerIdentity): Observable<CustomerIdentity> {
    return this.http.post<CustomerIdentity>(this.apiUrl, customerIdentity, this.httpOptions);
  }

  update(id: number, customerIdentity: CustomerIdentity): Observable<CustomerIdentity> {
    return this.http.put<CustomerIdentity>(`${this.apiUrl}/${id}`, customerIdentity, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  search(word: string): Observable<CustomerIdentity[]> {
    return this.http.get<CustomerIdentity[]>(`${this.apiUrl}/search?word=${word}`);
  }}
