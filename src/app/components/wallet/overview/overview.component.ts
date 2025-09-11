import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../../services/wallet.service';
import { WalletBalanceHistoryService } from '../../../services/wallet-balance-history.service';
import { AccountService } from '../../../services/account.service';
import { CardService } from '../../../services/card.service';
import { Wallet } from '../../../entities/wallet';
import { WalletBalanceHistory } from '../../../entities/wallet-balance-history';
import { Account } from '../../../entities/account';
import { Card } from '../../../entities/card';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  wallet?: Wallet;
  balanceHistory: WalletBalanceHistory[] = [];
  showHistoryPanel: boolean = false;
  isLoadingHistory: boolean = false;
  isBalanceHidden: boolean = false;
  showAddCardModal: boolean = false;
  showAddAccountModal: boolean = false;
  newCard: Card = new Card({
    carNumb: '',
    carLabe: '',
    carExpiryDate: undefined,
    cardType: undefined,
    carAmount: 0,
    carPlafond: 5000,
    carPlafondPeriod: 'MONTH'
  });
  newAccount: Account = new Account({
    accRib: '',
    accIden: '',
    accKey: '',
    accountType: undefined,
    bank: undefined,
    accBalance: 0.0
  });

  constructor(
    private router: Router,
    private walletService: WalletService,
    private walletBalanceHistoryService: WalletBalanceHistoryService,
    private accountService: AccountService,
    private cardService: CardService
  ) { }

  ngOnInit() {
    const cusCode = localStorage.getItem('cusCode');

    if (!cusCode) {
      this.router.navigate(['/login']);
      return;
    }

    this.walletService.getWalletByCustomerCode(parseInt(cusCode)).subscribe({
      next: (data: Wallet) => {
        this.wallet = data;

        // Initialize cardList and accountList if undefined
        if (!this.wallet.cardList) {
          this.wallet.cardList = { cliLabe: 'My Cards', cards: [] };
        }
        if (!this.wallet.accountList) {
          this.wallet.accountList = { aliLabe: 'My Accounts', accounts: [] };
        }

        // Test data
        this.wallet.cardList.cards = [
          { carNumb: '1234567890123456', cardType: { ctypLabe: 'visa' }, carExpiryDate: new Date('2025-12-31') },
          { carNumb: '9876543210987654', cardType: { ctypLabe: 'mastercard' }, carExpiryDate: new Date('2024-11-30') }
        ];
        this.wallet.accountList.accounts = [
          { 
            accIden: 'FR76 1234 5678 9012 3456 7890 123', 
            accRib: 'FR76 1234 5678 9012 3456 7890 123',
            accKey: 'KEY123',
            accountType: { atyLabe: 'checking' }, 
            bank: { banCorpName: 'Bank A' },
            accBalance: 1000.0
          },
          { 
            accIden: 'FR76 0987 6543 2109 8765 4321 098', 
            accRib: 'FR76 0987 6543 2109 8765 4321 098',
            accKey: 'KEY456',
            accountType: { atyLabe: 'savings' }, 
            bank: { banCorpName: 'Bank B' },
            accBalance: 2500.0
          }
        ];

        console.log('Wallet loaded:', this.wallet);
      },
      error: (err) => {
        console.error('Failed to load wallet', err);
        this.wallet = new Wallet();
        this.wallet.cardList = { cliLabe: 'My Cards', cards: [] };
        this.wallet.accountList = { aliLabe: 'My Accounts', accounts: [] };
      }
    });
  }

  // Method to mask card number
  maskCardNumber(cardNumber: string | undefined): string {
    if (!cardNumber) {
      return '•••• •••• •••• ••••';
    }
    const cleaned = cardNumber.replace(/\s/g, '');
    if (cleaned.length < 4) {
      return '•••• •••• •••• ••••';
    }
    return '**** **** **** ' + cleaned.substring(cleaned.length - 4);
  }

  // Method to mask RIB number
  maskRib(rib: string | undefined): string {
    if (!rib) {
      return '•••• •••• •••• ••••';
    }
    return rib.replace(/.{4}(?=.)/g, '•••• ');
  }

  loadBalanceHistory(): void {
    if (!this.wallet?.walCode) {
      console.error('Wallet or walCode is undefined');
      return;
    }
    
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

  toggleBalanceVisibility(): void {
    this.isBalanceHidden = !this.isBalanceHidden;
  }

  closeHistoryPanel(): void {
    this.showHistoryPanel = false;
  }

  goToTransfer() {
    this.router.navigate(['/wallet/transfer']);
  }

  openAddCardModal(): void {
    this.newCard = new Card({
      carNumb: '',
      carLabe: '',
      carExpiryDate: undefined,
      cardType: undefined,
      carAmount: 0,
      carPlafond: 5000,
      carPlafondPeriod: 'MONTH'
    });
    this.showAddCardModal = true;
  }

  closeAddCardModal(): void {
    this.showAddCardModal = false;
  }

  openAddAccountModal(): void {
    this.newAccount = new Account({
      accRib: '',
      accIden: '',
      accKey: '',
      accountType: undefined,
      bank: undefined,
      accBalance: 0.0
    });
    this.showAddAccountModal = true;
  }

  closeAddAccountModal(): void {
    this.showAddAccountModal = false;
  }

  addCard(): void {
    if (!this.newCard.carNumb || !this.newCard.carLabe || !this.newCard.carExpiryDate || !this.newCard.cardType) {
      alert('Please fill all required fields');
      return;
    }

    const cleanedCardNumber = this.newCard.carNumb.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cleanedCardNumber)) {
      alert('Card number must be 16 digits');
      return;
    }

    this.newCard.carNumb = cleanedCardNumber;
    
    this.cardService.create(this.newCard).subscribe({
      next: (createdCard) => {
        if (!this.wallet) {
          this.wallet = new Wallet();
        }
        if (!this.wallet.cardList) {
          this.wallet.cardList = { cliLabe: 'My Cards', cards: [] };
        }
        if (!this.wallet.cardList.cards) {
          this.wallet.cardList.cards = [];
        }
        this.wallet.cardList.cards.push(createdCard);
        this.closeAddCardModal();
      },
      error: (err) => {
        console.error('Failed to add card', err);
        alert('Failed to add card');
      }
    });
  }

  addAccount(): void {
    if (!this.newAccount.accRib || !this.newAccount.accKey || !this.newAccount.accountType || !this.newAccount.bank) {
      alert('Please fill all required fields');
      return;
    }

    if (!/^[A-Z0-9]{20,34}$/.test(this.newAccount.accRib)) {
      alert('RIB must be 20-34 alphanumeric characters');
      return;
    }

    this.accountService.createAccount(this.newAccount).subscribe({
      next: (createdAccount) => {
        if (!this.wallet) {
          this.wallet = new Wallet();
        }
        if (!this.wallet.accountList) {
          this.wallet.accountList = { aliLabe: 'My Accounts', accounts: [] };
        }
        if (!this.wallet.accountList.accounts) {
          this.wallet.accountList.accounts = [];
        }
        this.wallet.accountList.accounts.push(createdAccount);
        this.closeAddAccountModal();
      },
      error: (err) => {
        console.error('Failed to add account', err);
        alert('Failed to add account');
      }
    });
  }
}