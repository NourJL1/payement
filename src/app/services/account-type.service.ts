import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AccountType } from '../entities/account-type';


@Injectable({
  providedIn: 'root'
})
export class AccountTypeService {

private apiUrl = `${environment.apiUrl}/api/account-types`;

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };
  }

  create(accountType: AccountType): Observable<AccountType> {
    return this.http.post<AccountType>(this.apiUrl, accountType, { withCredentials: true });
  }

  update(id: number, accountType: AccountType): Observable<AccountType> {
    return this.http.put<AccountType>(`${this.apiUrl}/${id}`, accountType, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  getById(id: number): Observable<AccountType> {
    return this.http.get<AccountType>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  getAll(): Observable<AccountType[]> {
    return this.http.get<AccountType[]>(this.apiUrl, { withCredentials: true });
  }

  searchAccountTypes(searchWord: string): Observable<AccountType[]> {
    return this.http.get<AccountType[]>(`${this.apiUrl}/search?word=${searchWord}`, { withCredentials: true });
  }}
