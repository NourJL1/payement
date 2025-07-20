import { Injectable } from '@angular/core';
import { CustomerIdentityType } from '../entities/customer-identity-type';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerIdentityTypeService {

private apiUrl = `${environment.apiUrl}/api/customer-identity-type`;

  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getAll(): Observable<CustomerIdentityType[]> {
    return this.http.get<CustomerIdentityType[]>(this.apiUrl);
  }

  getById(id: number): Observable<CustomerIdentityType> {
    return this.http.get<CustomerIdentityType>(`${this.apiUrl}/${id}`);
  }

  create(identityType: CustomerIdentityType): Observable<CustomerIdentityType> {
    return this.http.post<CustomerIdentityType>(this.apiUrl, identityType, this.httpOptions);
  }

  update(id: number, identityType: CustomerIdentityType): Observable<CustomerIdentityType> {
    return this.http.put<CustomerIdentityType>(`${this.apiUrl}/${id}`, identityType, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  search(word: string): Observable<CustomerIdentityType[]> {
    return this.http.get<CustomerIdentityType[]>(`${this.apiUrl}/search?word=${word}`);
  }}
