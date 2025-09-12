import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OperationTypeService } from '../../../services/operation-type.service';
import { OperationType } from '../../../entities/operation-type';
import { environment } from '../../../../environments/environment';
import { CustomerService } from '../../../services/customer.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-transfer',
  imports: [CommonModule, FormsModule],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css'
})
export class TransferComponent implements OnInit {

  email?: string;

  // Form data
  senderWalletIden: string = '';
  receiverWalletIden: string = '';
  amount: number = 0;
  operationTypeIden: string = '';

  // QR Code specific fields
  currency: string = 'USD';
  transactionLabel: string = '';
  expiresAt: string = '';

  // OTP state
  isOtpSent: boolean = false;
  isOtpVerified: boolean = false;
  otpCode?: string;

  // UI state
  receiverInfo: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // Data from backend
  operationTypes: OperationType[] = [];
  senderWalletBalance: number = 0;

  // API base URL
  private apiBaseUrl = environment.apiUrl || '';

  constructor(
    private http: HttpClient,
    private operationTypeService: OperationTypeService,
    private customerService: CustomerService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadLoggedInUserWallet();
    this.loadOperationTypes();
    this.loadEmail();
  }

  loadEmail() {
    this.customerService.getEmail(parseInt(localStorage.getItem("cusCode")!)).subscribe({
      next: (res: any) => {
        this.email = res.email;
      },
      error: (err) => console.error('Failed to load email:', err)
    });
  }

  // Load the logged-in user's wallet information
  loadLoggedInUserWallet() {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (currentUser) {
        if (currentUser.wallet) {
          this.senderWalletIden = currentUser.wallet.walIden || 'WAL-unknown';
          this.senderWalletBalance = currentUser.wallet.walLogicBalance || currentUser.wallet.walEffBal || 0;
        } else {
          this.senderWalletIden = currentUser.walIden || 'WAL-unknown';
          this.senderWalletBalance = currentUser.walLogicBalance || currentUser.walEffBal || 0;
        }
      } else {
        this.senderWalletIden = 'WAL-not-logged-in';
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
        // Fallback options
        this.operationTypes = [
          { optIden: '2020', optLabe: 'WALLET TO WALLET', optCode: 3 } as OperationType,
          { optIden: 'OPT-003', optLabe: 'QR CODE', optCode: 4 } as OperationType,
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

  clearForm(clearMessages: boolean = true) {
    this.receiverWalletIden = '';
    this.amount = 0;
    this.operationTypeIden = '';
    this.receiverInfo = '';
    this.currency = 'USD';
    this.transactionLabel = '';
    this.expiresAt = '';
    this.otpCode = '';
    this.isOtpSent = false;
    this.isOtpVerified = false;

    if (clearMessages) {
      this.errorMessage = '';
      this.successMessage = '';
    }
  }

  checkForm() {
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
    this.sendOtp();
  }

  sendOtp() {
    this.authService.sendEmail(this.email!, "confirm").subscribe({
      next: (result: any) => {
        if (result.message !== 'success') {
          this.errorMessage = result.message;
        } else {
          this.successMessage = 'An email has been sent to your address to verify.';
          this.isOtpSent = true;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to send email. Please try again.';
        console.error('mailing Failed: ', err);
        this.isLoading = false;
      }
    });
  }

  verifyOtp() {
    this.authService.verifyOTP(this.email!, this.otpCode!).subscribe({
      next: (verif: boolean) => {
        this.isOtpVerified = verif;
        if (!verif) {
          this.errorMessage = 'OTP verification failed. Please try again.';
        } else {
          this.errorMessage = '';
          this.successMessage = 'OTP verified successfully!';
          this.transferNow();
        }
      },
      error: (err) => {
        this.errorMessage = 'OTP verification failed. Please try again.\n' + err.message;
      }
    });
  }

  // Submit the transfer
  transferNow() {
  if (!this.isOtpVerified) {
    this.errorMessage = 'Please verify the OTP before transferring.';
    return;
  }

  this.isLoading = true;

  let transferRequest: any = {
    senderWalletIden: this.senderWalletIden,
    receiverWalletIden: this.receiverWalletIden,
    amount: this.amount,
    operationTypeIden: this.operationTypeIden
  };

  if (this.operationTypeIden === 'OPT-003') {
    transferRequest.currency = this.currency;
    transferRequest.transactionLabel = this.transactionLabel;
    transferRequest.expiresAt = this.expiresAt;
  }

  console.log('Sending transfer request:', transferRequest);
  this.tryTransferEndpoints(transferRequest);
}


  private tryTransferEndpoints(transferRequest: any) {
    const endpoints = [
      `${this.apiBaseUrl}/api/transfer/wallet-to-wallet`,
      `${this.apiBaseUrl}/transfer/wallet-to-wallet`,
      `${this.apiBaseUrl}/api/wallet/transfer`,
      `${this.apiBaseUrl}/wallet/transfer`,
      '/api/transfer/wallet-to-wallet',
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
        next: (response) => this.handleTransferSuccess(response),
        error: (error: HttpErrorResponse) => {
          if (error.status === 404 && currentAttempt < endpoints.length - 1) {
            currentAttempt++;
            tryNextEndpoint();
          } else {
            this.handleTransferError(error);
          }
        }
      });
    };

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

    this.clearForm(false); // Keep success message
  }

  private handleTransferError(error: HttpErrorResponse) {
    this.isLoading = false;
    this.errorMessage = error.error?.message || 'Transfer failed. Please try again.';
    console.error('Transfer error:', error);
  }

  demoTransfer() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = 'Transfer successful! Transaction ID: TXN-12345';
      this.senderWalletBalance -= this.amount;
      this.clearForm(false);
    }, 2000);
  }
}
