import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AccountList } from '../entities/account-list';

@Injectable({
  providedIn: 'root'
})
export class AccountListService {

   private apiUrl = `${environment.apiUrl}/api/account-lists`;

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };
  }

  // Create a new account list
  create(accountList: AccountList): Observable<AccountList> {
    return this.http.post<AccountList>(this.apiUrl, accountList, this.getHttpOptions());
  }

  // Update account list by ID
  update(id: number, accountList: AccountList): Observable<AccountList> {
    return this.http.put<AccountList>(`${this.apiUrl}/${id}`, accountList, this.getHttpOptions());
  }

  // Delete account list by ID
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  // Get account list by ID
  getById(id: number): Observable<AccountList> {
    return this.http.get<AccountList>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  // Get all account lists
  getAll(): Observable<AccountList[]> {
    return this.http.get<AccountList[]>(this.apiUrl, this.getHttpOptions());
  }

  // Search account lists by word
  searchAccountLists(word: string): Observable<AccountList[]> {
    return this.http.get<AccountList[]>(`${this.apiUrl}/search?word=${word}`, this.getHttpOptions());
  }
}
