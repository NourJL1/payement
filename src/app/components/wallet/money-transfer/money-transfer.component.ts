import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { Account } from '../../../entities/account';
import { Wallet } from '../../../entities/wallet';
import { TransferService, TransferRequest } from '../../../services/transfer.service';
import { WalletService } from '../../../services/wallet.service';

@Component({
  selector: 'app-money-transfer',
  templateUrl: './money-transfer.component.html',
  styleUrls: ['./money-transfer.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class MoneyTransferComponent implements OnInit {
  transferForm: FormGroup;
  linkedAccounts: Account[] = [];
  wallet: Wallet | null = null;
  isLoading = false;
  transferSuccess = false;
  errorMessage = '';
  transferDetails: any = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private transferService: TransferService,
    private walletService: WalletService
  ) {
    this.transferForm = this.fb.group({
      account: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.loadLinkedAccounts();
    this.loadWallet();
  }

// In money-transfer.component.ts
loadLinkedAccounts(): void {
  this.isLoading = true;
  
  // Check if we have a wallet with an account list
  if (this.wallet && this.wallet.accountList && this.wallet.accountList.aliCode) {
    // Fetch accounts by account list ID (which is linked to the wallet)
    this.http.get<Account[]>(`${environment.apiUrl}/api/accounts/account-list/${this.wallet.accountList.aliCode}`)
      .subscribe({
        next: (accounts) => {
          this.linkedAccounts = accounts;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading linked accounts:', error);
          // Fallback to all accounts if specific endpoint fails
          this.loadAllAccountsAsFallback();
        }
      });
  } else {
    // Wait for wallet to load first, then try again
    setTimeout(() => {
      if (this.wallet && this.wallet.accountList) {
        this.loadLinkedAccounts(); // Try again
      } else {
        this.loadAllAccountsAsFallback();
      }
    }, 500);
  }
}

// Fallback method if the specific endpoint doesn't work
private loadAllAccountsAsFallback(): void {
  this.http.get<Account[]>(`${environment.apiUrl}/api/accounts`)
    .subscribe({
      next: (accounts) => {
        // Filter accounts manually by checking if they belong to the wallet's account list
        if (this.wallet && this.wallet.accountList && this.wallet.accountList.aliCode) {
          this.linkedAccounts = accounts.filter(account => 
            account.accountList?.aliCode === this.wallet?.accountList?.aliCode
          );
        } else {
          this.linkedAccounts = accounts;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
        this.errorMessage = 'Failed to load linked accounts';
        this.isLoading = false;
      }
    });
}

  // NEW: Try using cached wallet (from overview), otherwise fallback to customer-code lookup
  loadWallet(): void {
    const currentWalletRaw = localStorage.getItem('currentWallet');
    if (currentWalletRaw) {
      try {
        const parsed = JSON.parse(currentWalletRaw);
        if (parsed?.walCode) {
          console.log('Using cached wallet from localStorage (walCode):', parsed.walCode);
          // fetch fresh wallet by walCode (keeps data fresh & consistent)
          this.walletService.getById(parsed.walCode).subscribe({
            next: (wallet) => {
              console.log('Loaded wallet by ID (from cache walCode):', wallet);
              this.wallet = wallet;
            },
            error: (err) => {
              console.error('Failed to fetch wallet by walCode, falling back to customer code', err);
              this.fallbackLoadByCustomer();
            }
          });
          return;
        }
      } catch (e) {
        console.warn('Failed to parse currentWallet from localStorage', e);
        // fallthrough to fallback
      }
    }

    // no cached wallet found -> fallback
    this.fallbackLoadByCustomer();
  }

  private fallbackLoadByCustomer(): void {
    const cusCodeRaw = localStorage.getItem('cusCode');
    if (cusCodeRaw) {
      const cusCode = Number(cusCodeRaw);
      console.log('Loading wallet by customer code (fallback):', cusCode);
      this.walletService.getWalletByCustomerCode(cusCode).subscribe({
        next: (wallet) => {
          console.log('Loaded wallet by customer code:', wallet);
          this.wallet = wallet;
        },
        error: (err) => {
          console.error('Error loading wallet by customer code:', err);
          this.errorMessage = 'Failed to load wallet information';
        }
      });
    } else {
      // As a final fallback try the "currentUser" object (older code paths)
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          const customerCode = user.customerCode || user.customer?.cusCode;
          if (customerCode) {
            console.log('Fallback: loading wallet by customerCode from currentUser:', customerCode);
            this.walletService.getWalletByCustomerCode(Number(customerCode)).subscribe({
              next: (wallet) => {
                console.log('Loaded wallet by customer code (from currentUser):', wallet);
                this.wallet = wallet;
              },
              error: (err) => {
                console.error('Error loading wallet in fallback path:', err);
                this.errorMessage = 'Failed to load wallet information';
              }
            });
            return;
          }
        } catch (e) {
          console.warn('Failed to parse currentUser from localStorage', e);
        }
      }

      console.warn('No customer code available in localStorage; wallet load skipped');
      this.errorMessage = 'Wallet not found (no customer info)';
    }
  }

  onSubmit(): void {
    console.log('Form valid:', this.transferForm.valid);
    console.log('Wallet:', this.wallet);

    if (this.transferForm.valid && this.wallet) {
      this.isLoading = true;
      this.errorMessage = '';
      this.transferSuccess = false;
      this.transferDetails = null;

      const selectedAccountCode = Number(this.transferForm.value.account);
      const selectedAccount = this.linkedAccounts.find(acc => acc.accCode === selectedAccountCode);
      const amount = Number(this.transferForm.value.amount);

      console.log('Selected account code:', selectedAccountCode);
      console.log('Amount:', amount);
      console.log('All linked accounts:', this.linkedAccounts);
      console.log('Found account:', selectedAccount);

      if (!selectedAccount) {
        this.errorMessage = 'Selected account not found';
        this.isLoading = false;
        return;
      }

      if ((selectedAccount.accBalance ?? 0) < amount) {
        this.errorMessage = 'Insufficient balance in the selected account';
        this.isLoading = false;
        return;
      }

      const transferRequest: TransferRequest = {
        accountId: selectedAccount.accCode,
        walletId: this.wallet.walCode!, // MUST be walCode (not walIden)
        amount: amount
      };

      console.log('Preparing transfer request with walCode:', transferRequest.walletId);

      this.transferService.transferFromAccountToWallet(transferRequest)
        .subscribe({
          next: (response) => {
            this.transferSuccess = true;
            this.transferDetails = response;
            this.isLoading = false;
            this.transferForm.reset();

            console.log('Balance history recorded with ID:', response.balanceHistoryId);

            this.loadLinkedAccounts();
            this.loadWallet(); // refresh wallet after successful transfer
          },
          error: (error) => {
            console.error('Transfer error:', error);
            // Robust handling: server might return string or object or parsing error
            let serverMsg = 'Transfer failed. Please try again.';
            try {
              if (typeof error.error === 'string') {
                serverMsg = error.error;
              } else if (error.error && error.error.message) {
                serverMsg = error.error.message;
              } else if (error.message) {
                serverMsg = error.message;
              } else {
                serverMsg = JSON.stringify(error.error || error);
              }
            } catch (e) {
              serverMsg = 'Transfer failed (unexpected error)';
            }
            this.errorMessage = serverMsg;
            this.isLoading = false;
          }
        });
    }
  }

  getSelectedAccount(): Account | null {
    const accountCode = Number(this.transferForm.get('account')?.value);
    if (!accountCode) return null;
    return this.linkedAccounts.find(acc => acc.accCode === accountCode) || null;
  }

  private getCurrentCustomerCode(): number {
    // still available if you need it elsewhere
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      console.log('Extracted customerCode from currentUser:', user.customerCode);
      return user.customerCode || 1;
    }
    return 1;
  }

  formatCurrency(amount: number | undefined): string {
    if (amount === undefined || amount === null) {
      return 'TND 0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TND'
    }).format(amount);
  }

  resetForm(): void {
    this.transferForm.reset();
    this.transferSuccess = false;
    this.errorMessage = '';
    this.transferDetails = null;
  }
}
