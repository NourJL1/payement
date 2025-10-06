import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Account } from '../entities/account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

   private apiUrl = `${environment.apiUrl}/api/accounts`;

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
  }

  // Create a new account
  createAccount(account: Account): Observable<Account> {
  return this.http.post<Account>(this.apiUrl, account, this.getHttpOptions()).pipe(
    catchError(error => {
      console.error('createAccount: Error:', error);
      
      // Enhanced error handling for duplicates
      if (error.status === 400 || error.status === 409 || 
          error.error?.message?.includes('already exists') ||
          error.message?.includes('already exists')) {
        return throwError(() => new Error('This RIB is already registered in the system'));
      }
      
      return throwError(() => new Error(error.error?.message || 'Failed to create account'));
    })
  );
}

  // Get account by ID
  getAccountById(id: number): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  // Get all accounts
  getAllAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl, this.getHttpOptions());
  }

  // Update an account
  updateAccount(id: number, account: Account): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/${id}`, account, this.getHttpOptions());
  }

  // Delete an account
  deleteAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  // Search accounts by word
  searchAccounts(word: string): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/search?word=${word}`, this.getHttpOptions());
  }

  
}
