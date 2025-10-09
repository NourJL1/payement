import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WalletBalanceHistory } from '../entities/wallet-balance-history';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WalletBalanceHistoryService {

private apiUrl = `${environment.apiUrl}/api/wallet-balance-history`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  getAll(): Observable<WalletBalanceHistory[]> {
    return this.http.get<WalletBalanceHistory[]>(this.apiUrl, { withCredentials: true });
  }

  getById(id: number): Observable<WalletBalanceHistory> {
    return this.http.get<WalletBalanceHistory>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  getByWalletCode(walCode: number): Observable<WalletBalanceHistory[]> {
    return this.http.get<WalletBalanceHistory[]>(`${this.apiUrl}/wallet/${walCode}`, { withCredentials: true });
  }

  create(walletBalanceHistory: WalletBalanceHistory): Observable<WalletBalanceHistory> {
    return this.http.post<WalletBalanceHistory>(this.apiUrl, walletBalanceHistory, { withCredentials: true });
  }

  update(id: number, walletBalanceHistory: WalletBalanceHistory): Observable<WalletBalanceHistory> {
    return this.http.put<WalletBalanceHistory>(`${this.apiUrl}/${id}`, walletBalanceHistory, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  search(word: string): Observable<WalletBalanceHistory[]> {
    return this.http.get<WalletBalanceHistory[]>(`${this.apiUrl}/search?word=${word}`, { withCredentials: true });
  }}
