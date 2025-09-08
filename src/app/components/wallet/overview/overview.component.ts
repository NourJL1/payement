import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../../services/wallet.service';
import { WalletBalanceHistoryService } from '../../../services/wallet-balance-history.service';
import { Wallet } from '../../../entities/wallet';
import { WalletBalanceHistory } from '../../../entities/wallet-balance-history';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-overview',
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {

  constructor(
    private router: Router,
    private walletService: WalletService,
    private walletBalanceHistoryService: WalletBalanceHistoryService
  ) { }

  wallet?: Wallet;
  balanceHistory: WalletBalanceHistory[] = [];
  showHistoryPanel: boolean = false;
  isLoadingHistory: boolean = false;

  ngOnInit() {
    const cusCode = localStorage.getItem('cusCode');

    if (!cusCode) {
      this.router.navigate(['/login']);
      return;
    }

    this.walletService.getWalletByCustomerCode(parseInt(cusCode)).subscribe({
      next: (data: Wallet) => {
        this.wallet = data;

        // test only data
        this.wallet.cardList = {
          cliLabe: 'My Cards',
          cards: [
            { carNumb: '1234 5678 9012 3456', cardType: { ctypLabe: 'visa' }, carExpiryDate: new Date('2025-12-31') },
            { carNumb: '9876 5432 1098 7654', cardType: { ctypLabe: 'mastercard' }, carExpiryDate: new Date('2024-11-30') }
          ]
        };
        this.wallet.accountList = {
          aliLabe: 'My Accounts',
          accounts: [
            { accIden: 'FR76 1234 5678 9012 3456 7890 123', accountType: { atyLabe: 'checking' }, bank: { banCorpName: 'Bank A' } },
            { accIden: 'FR76 0987 6543 2109 8765 4321 098', accountType: { atyLabe: 'savings' }, bank: { banCorpName: 'Bank B' } }
          ]
        };

        console.log('Wallet loaded:', this.wallet);
      },
      error: (err) => {
        console.error('Failed to load wallet', err);
      }
    });
  }

  loadBalanceHistory(): void {
    if (!this.wallet?.walCode) return;
    
    this.isLoadingHistory = true;
    this.walletBalanceHistoryService.getByWalletCode(this.wallet.walCode).subscribe({
      next: (data: WalletBalanceHistory[]) => {
        this.balanceHistory = data;
        this.showHistoryPanel = true;
        this.isLoadingHistory = false;
      },
      error: (err) => {
        console.error('Failed to load balance history', err);
        this.isLoadingHistory = false;
      }
    });
  }
  // Add this property to your component class
isBalanceHidden: boolean = false;

// Add this method to your component class
toggleBalanceVisibility(): void {
  this.isBalanceHidden = !this.isBalanceHidden;
}

  closeHistoryPanel(): void {
    this.showHistoryPanel = false;
  }

   goToTransfer() {
    this.router.navigate(['/wallet/transfer']);
  }
}