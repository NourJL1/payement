import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WalletCategory } from '../entities/wallet-category';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WalletCategoryService {
  private apiUrl = `${environment.apiUrl}/api/wallet-categories`;

  constructor(private http: HttpClient) {}

  private getHttpOptions(): { headers: HttpHeaders } {
    const role = localStorage.getItem('role') || 'ROLE_ADMIN';
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Roles': role
      })
    };
  }

  getAll(httpOptions: { headers: HttpHeaders } = this.getHttpOptions()): Observable<WalletCategory[]> {
    return this.http.get<WalletCategory[]>(this.apiUrl, httpOptions);
  }

  getById(id: number, httpOptions: { headers: HttpHeaders } = this.getHttpOptions()): Observable<WalletCategory> {
    return this.http.get<WalletCategory>(`${this.apiUrl}/${id}`, httpOptions);
  }

  create(walletCategory: WalletCategory, httpOptions: { headers: HttpHeaders } = this.getHttpOptions()): Observable<WalletCategory> {
    return this.http.post<WalletCategory>(this.apiUrl, walletCategory, httpOptions);
  }

  update(id: number, walletCategory: WalletCategory, httpOptions: { headers: HttpHeaders } = this.getHttpOptions()): Observable<WalletCategory> {
    return this.http.put<WalletCategory>(`${this.apiUrl}/${id}`, walletCategory, httpOptions);
  }

  delete(id: number, httpOptions: { headers: HttpHeaders } = this.getHttpOptions()): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, httpOptions);
  }

  search(word: string, httpOptions: { headers: HttpHeaders } = this.getHttpOptions()): Observable<WalletCategory[]> {
    return this.http.get<WalletCategory[]>(`${this.apiUrl}/search?word=${word}`, httpOptions);
  }
}