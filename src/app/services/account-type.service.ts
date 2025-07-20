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
    return this.http.post<AccountType>(this.apiUrl, accountType, this.getHttpOptions());
  }

  update(id: number, accountType: AccountType): Observable<AccountType> {
    return this.http.put<AccountType>(`${this.apiUrl}/${id}`, accountType, this.getHttpOptions());
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  getById(id: number): Observable<AccountType> {
    return this.http.get<AccountType>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  getAll(): Observable<AccountType[]> {
    return this.http.get<AccountType[]>(this.apiUrl, this.getHttpOptions());
  }

  searchAccountTypes(searchWord: string): Observable<AccountType[]> {
    return this.http.get<AccountType[]>(`${this.apiUrl}/search?word=${searchWord}`, this.getHttpOptions());
  }}
