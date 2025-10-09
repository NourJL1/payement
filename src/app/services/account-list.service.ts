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
    return this.http.post<AccountList>(this.apiUrl, accountList, { withCredentials: true });
  }

  // Update account list by ID
  update(id: number, accountList: AccountList): Observable<AccountList> {
    return this.http.put<AccountList>(`${this.apiUrl}/${id}`, accountList, { withCredentials: true });
  }

  // Delete account list by ID
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  // Get account list by ID
  getById(id: number): Observable<AccountList> {
    return this.http.get<AccountList>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  // Get all account lists
  getAll(): Observable<AccountList[]> {
    return this.http.get<AccountList[]>(this.apiUrl, { withCredentials: true });
  }

  // Search account lists by word
  searchAccountLists(word: string): Observable<AccountList[]> {
    return this.http.get<AccountList[]>(`${this.apiUrl}/search?word=${word}`, { withCredentials: true });
  }
}
