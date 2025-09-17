import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// transfer.service.ts - Add this interface
export interface TransferRequest {
  accountId: number | undefined;
  walletId: number | undefined;
  amount: number;
}

export interface TransferResponse {
  success: boolean;
  message: string;
  newAccountBalance: number;
  newWalletBalance: number;
  transactionId: string;
  balanceHistoryId: number;
}

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  transferFromAccountToWallet(request: TransferRequest): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(
      `${this.apiUrl}/api/transfers/account-to-wallet`, 
      request
    );
  }
}