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

  getAll(): Observable<WalletCategory[]> {
    return this.http.get<WalletCategory[]>(this.apiUrl, { withCredentials: true });
  }

  getById(id: number): Observable<WalletCategory> {
    return this.http.get<WalletCategory>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  create(walletCategory: WalletCategory): Observable<WalletCategory> {
    return this.http.post<WalletCategory>(this.apiUrl, walletCategory, { withCredentials: true });
  }

  update(id: number, walletCategory: WalletCategory): Observable<WalletCategory> {
    return this.http.put<WalletCategory>(`${this.apiUrl}/${id}`, walletCategory, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  search(word: string): Observable<WalletCategory[]> {
    return this.http.get<WalletCategory[]>(`${this.apiUrl}/search?word=${word}`, { withCredentials: true });
  }
}