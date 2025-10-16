import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { interval, switchMap, distinctUntilChanged } from 'rxjs';
import { Wallet } from '../entities/wallet';
import { WalletStatus } from '../entities/wallet-status';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private apiUrl = `${environment.apiUrl}/api/wallets`;

  constructor(
    private http: HttpClient,
  ) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role') || 'CUSTOMER';
    const rolesHeader = `ROLE_${role.toUpperCase()}`;

    let headers = new HttpHeaders({
      'X-Roles': rolesHeader,
      'Content-Type': 'application/json',
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  getAll(): Observable<Wallet[]> {
    return this.http.get<Wallet[]>(this.apiUrl, { withCredentials: true, headers: this.getHeaders() })/* .pipe(
      map(wallets => wallets.map(wallet => new Wallet({
        walCode: wallet.walCode,
        walIden: wallet.walIden,
        walLabe: wallet.walLabe,
        walletStatus: wallet.walletStatus,
        walletType: wallet.walletType,
        lastUpdatedDate: wallet.lastUpdatedDate,
        createdAt: wallet.createdAt,
        walletCategory: wallet.walletCategory,
        walFinId: wallet.walFinId,
        customer: wallet.customer,
        walEffBal: wallet.walEffBal || 0,
        walLogicBalance: wallet.walLogicBalance || 0,
        walSpecificBalance: wallet.walSpecificBalance || 0,
        walletOperations: wallet.walletOperations,
        lastBalanceHistory: wallet.lastBalanceHistory,  
        operationTypes: wallet.operationTypes,
        cardList: wallet.cardList,
        accountList: wallet.accountList,
        walKey: wallet.walKey,
      }))),
      catchError(error => {
        console.error('Error fetching wallets:', error);
        return throwError(() => new Error('Failed to fetch wallets'));
      })
    ); */
  }

  getWalletByCustomerCode(cusCode: number): Observable<Wallet> {
    console.log(`${this.apiUrl}/by-customer-code/${cusCode}`)
    return this.http.get<Wallet>(`${this.apiUrl}/by-customer-code/${cusCode}`, {withCredentials: true});
  }

  getWalletCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`, { withCredentials: true, headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error fetching wallet count:', error);
        return throwError(() => new Error('Failed to fetch wallet count'));
      })
    );
  }
  getActiveWalletCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/active`, { withCredentials: true, headers: this.getHeaders() });
  }

  getPendingWalletCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/pending`, { withCredentials: true, headers: this.getHeaders() });
  }

  getWalletStatus(): Observable<WalletStatus> {
    const cusCode = localStorage.getItem('cusCode');
    if (!cusCode) {
      return throwError(() => new Error('No customer code found in localStorage'));
    }

    return this.http.get<any>(`${this.apiUrl}/by-customer/${cusCode}/status`, { withCredentials: true, headers: this.getHeaders() }).pipe(
      map(response => {
        if (!response) throw new Error('No wallet status found');
        return new WalletStatus({
          wstCode: response.wstCode,
          wstIden: response.wstIden,
          wstLabe: response.wstLabe,
        });
      }),
      catchError(error => {
        console.error('Error fetching wallet status:', error);
        return throwError(() => new Error('Wallet status not found or server error'));
      })
    );
  }

  startStatusPolling(intervalMs: number = 30000): Observable<WalletStatus> {
    return interval(intervalMs).pipe(
      switchMap(() => this.getWalletStatus()),
      distinctUntilChanged((prev, curr) => prev.wstIden === curr.wstIden)
    );
  }

  create(wallet: Wallet): Observable<Wallet> {
    return this.http.post<Wallet>(this.apiUrl, wallet, { withCredentials: true, headers: this.getHeaders() }).pipe(
      map(createdWallet => new Wallet({
        walCode: createdWallet.walCode,
        walIden: createdWallet.walIden,
        walLabe: createdWallet.walLabe,
        walKey: createdWallet.walKey,
        walEffBal: createdWallet.walEffBal,
        walLogicBalance: createdWallet.walLogicBalance,
        walSpecificBalance: createdWallet.walSpecificBalance,
        lastUpdatedDate: createdWallet.lastUpdatedDate,
        walFinId: createdWallet.walFinId
      })),
      catchError(error => {
        console.error('Error creating wallet:', error);
        return throwError(() => new Error('Failed to create wallet'));
      })
    );
  }

  update(walCode: number, wallet: Wallet): Observable<Wallet> {
    return this.http.put<Wallet>(`${this.apiUrl}/${walCode}`, wallet, { withCredentials: true, headers: this.getHeaders() }).pipe(
      map(updatedWallet => new Wallet({
        walCode: updatedWallet.walCode,
        walIden: updatedWallet.walIden,
        walLabe: updatedWallet.walLabe,
        walKey: updatedWallet.walKey,
        walEffBal: updatedWallet.walEffBal,
        walLogicBalance: updatedWallet.walLogicBalance,
        walSpecificBalance: updatedWallet.walSpecificBalance,
        lastUpdatedDate: updatedWallet.lastUpdatedDate,
        walFinId: updatedWallet.walFinId
      })),
      catchError(error => {
        console.error('Error updating wallet:', error);
        return throwError(() => new Error('Failed to update wallet'));
      })
    );
  }

  delete(walCode: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${walCode}`, { withCredentials: true, headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error deleting wallet:', error);
        return throwError(() => new Error('Failed to delete wallet'));
      })
    );
  }

  getById(walCode: number): Observable<Wallet> {
    return this.http.get<Wallet>(`${this.apiUrl}/${walCode}`, { withCredentials: true, headers: this.getHeaders() }).pipe(
      map(wallet => new Wallet({
        walCode: wallet.walCode,
        walIden: wallet.walIden,
        walLabe: wallet.walLabe,
        walKey: wallet.walKey,
        walEffBal: wallet.walEffBal,
        walLogicBalance: wallet.walLogicBalance,
        walSpecificBalance: wallet.walSpecificBalance,
        lastUpdatedDate: wallet.lastUpdatedDate,
        walFinId: wallet.walFinId
      })),
      catchError(error => {
        console.error('Error fetching wallet by ID:', error);
        return throwError(() => new Error('Failed to fetch wallet'));
      })
    );
  }

  search(word: string){
    return this.http.get<Wallet[]>(`${this.apiUrl}/search?word=${word}`, { withCredentials: true, headers: this.getHeaders() })
  }

  // wallet.service.ts
getWalletCountByCategory(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/count/by-category`, { withCredentials: true, headers: this.getHeaders() }).pipe(
        catchError(error => {
            console.error('Error fetching wallet counts by category:', error);
            return throwError(() => new Error('Failed to fetch wallet counts by category'));
        })
    );
}
}