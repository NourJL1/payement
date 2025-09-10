import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OperationTypeService } from '../../../services/operation-type.service';
import { OperationType } from '../../../entities/operation-type';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-transfer',
  imports: [CommonModule, FormsModule],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css'
})
export class TransferComponent implements OnInit {
  // Form data
  senderWalletIden: string = '';
  receiverWalletIden: string = '';
  amount: number = 0;
  operationTypeIden: string = '';
  
  // UI state
  receiverInfo: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  // Data from backend
  operationTypes: OperationType[] = [];
  senderWalletBalance: number = 2847.50;

  // API base URL
  private apiBaseUrl = environment.apiUrl || '';

  constructor(
    private http: HttpClient,
    private operationTypeService: OperationTypeService
  ) {}

  ngOnInit() {
    this.loadLoggedInUserWallet();
    this.loadOperationTypes();
  }

  // Load the logged-in user's wallet information
  // Load the logged-in user's wallet information
loadLoggedInUserWallet() {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (currentUser) {
      // Check if wallet data is available in the new structure
      if (currentUser.wallet) {
        this.senderWalletIden = currentUser.wallet.walIden || 'WAL-unknown';
        this.senderWalletBalance = currentUser.wallet.walLogicBalance || currentUser.wallet.walEffBal || 0;
      } else {
        // Fallback for old structure or missing wallet
        this.senderWalletIden = currentUser.walIden || 'WAL-unknown';
        this.senderWalletBalance = currentUser.walLogicBalance || currentUser.walEffBal || 0;
      }
      
      console.log('Wallet loaded:', {
        walletIden: this.senderWalletIden,
        balance: this.senderWalletBalance
      });
    } else {
      this.senderWalletIden = 'WAL-not-logged-in';
      console.warn('No user found in localStorage');
    }
  } catch (e) {
    console.error('Error loading user wallet:', e);
    this.senderWalletIden = 'WAL-error';
  }
}

  // Load available operation types from backend
  loadOperationTypes() {
    this.operationTypeService.getAll().subscribe({
      next: (types) => {
        this.operationTypes = types;
      },
      error: (error) => {
        console.error('Failed to load operation types:', error);
        this.errorMessage = 'Failed to load operation options';
        
        this.operationTypes = [
          { optIden: 'OPT-W2W', optLabe: 'Wallet to Wallet Transfer', optCode: 1 } as OperationType,
          { optIden: 'OPT-QR', optLabe: 'QR Code Payment', optCode: 2 } as OperationType,
          { optIden: 'OPT-BILL', optLabe: 'Bill Payment', optCode: 3 } as OperationType
        ];
      }
    });
  }

  // Find user by wallet ID
  findUser() {
    if (!this.receiverWalletIden) {
      this.errorMessage = 'Please enter a wallet ID';
      return;
    }

    if (this.receiverWalletIden === this.senderWalletIden) {
      this.errorMessage = 'Cannot transfer to your own wallet';
      return;
    }

    if (this.receiverWalletIden.startsWith('WAL-') || this.receiverWalletIden.startsWith('WLT-')) {
      this.receiverInfo = `Wallet ID validated: ${this.receiverWalletIden}`;
      this.errorMessage = '';
    } else {
      this.receiverInfo = '';
      this.errorMessage = 'Please enter a valid wallet ID (should start with WAL- or WLT-)';
    }
  }

  // Use maximum available balance
  useMaxBalance() {
    this.amount = this.senderWalletBalance;
  }

  // Submit the transfer
  transferNow() {
    // Validation
    if (!this.receiverWalletIden) {
      this.errorMessage = 'Please enter a receiver wallet ID';
      return;
    }

    if (!this.amount || this.amount <= 0) {
      this.errorMessage = 'Please enter a valid amount';
      return;
    }

    if (!this.operationTypeIden) {
      this.errorMessage = 'Please select an operation type';
      return;
    }

    if (this.amount > this.senderWalletBalance) {
      this.errorMessage = 'Insufficient balance';
      return;
    }

    if (this.receiverWalletIden === this.senderWalletIden) {
      this.errorMessage = 'Cannot transfer to your own wallet';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const transferRequest = {
      senderWalletIden: this.senderWalletIden,
      receiverWalletIden: this.receiverWalletIden,
      amount: this.amount,
      operationTypeIden: this.operationTypeIden
    };

    console.log('Sending transfer request:', transferRequest);

    // Try different API endpoints
    this.tryTransferEndpoints(transferRequest);
  }

  // Try different possible API endpoints
  private tryTransferEndpoints(transferRequest: any) {
    const endpoints = [
      `${this.apiBaseUrl}/api/transfer/wallet-to-wallet`,
      `${this.apiBaseUrl}/transfer/wallet-to-wallet`,
      `${this.apiBaseUrl}/api/wallet/transfer`,
      `${this.apiBaseUrl}/wallet/transfer`,
      '/api/transfer/wallet-to-wallet', // Fallback without base URL
      '/transfer/wallet-to-wallet'
    ];

    let currentAttempt = 0;

    const tryNextEndpoint = () => {
      if (currentAttempt >= endpoints.length) {
        this.isLoading = false;
        this.errorMessage = 'Transfer service is currently unavailable. Please try again later.';
        return;
      }

      const endpoint = endpoints[currentAttempt];
      console.log(`Trying endpoint: ${endpoint}`);

      this.http.post<any>(endpoint, transferRequest).subscribe({
        next: (response) => {
          this.handleTransferSuccess(response);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 404 && currentAttempt < endpoints.length - 1) {
            // Try next endpoint
            currentAttempt++;
            tryNextEndpoint();
          } else {
            this.handleTransferError(error);
          }
        }
      });
    };

    // Start with the first endpoint
    tryNextEndpoint();
  }

  private handleTransferSuccess(response: any) {
    this.isLoading = false;
    this.successMessage = `${response.message} Transaction ID: ${response.transactionId}`;
    
    if (response.totalDebited) {
      this.senderWalletBalance -= response.totalDebited;
    } else {
      this.senderWalletBalance -= this.amount;
    }
    
    this.receiverWalletIden = '';
    this.amount = 0;
    this.operationTypeIden = '';
    this.receiverInfo = '';
  }

  private handleTransferError(error: HttpErrorResponse) {
    this.isLoading = false;
    
    if (error.status === 404) {
      this.errorMessage = 'Transfer service is currently unavailable. Please try again later.';
    } else if (error.error && error.error.message) {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage = 'Transfer failed. Please try again.';
    }
    
    console.error('Transfer error:', error);
  }

  // Demo mode for testing without backend
  demoTransfer() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Simulate API delay
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = 'Transfer successful! Transaction ID: TXN-12345';
      this.senderWalletBalance -= this.amount;
      
      this.receiverWalletIden = '';
      this.amount = 0;
      this.operationTypeIden = '';
      this.receiverInfo = '';
    }, 2000);
  }
}