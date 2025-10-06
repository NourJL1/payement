import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../../services/wallet.service';
import { WalletBalanceHistoryService } from '../../../services/wallet-balance-history.service';
import { AccountService } from '../../../services/account.service';
import { CardService } from '../../../services/card.service';
import { CardListService } from '../../../services/card-list.service';
import { AccountListService } from '../../../services/account-list.service';
import { CardTypeService } from '../../../services/card-type.service';
import { AccountTypeService } from '../../../services/account-type.service';
import { BankService } from '../../../services/bank.service';
import { Wallet } from '../../../entities/wallet';
import { WalletBalanceHistory } from '../../../entities/wallet-balance-history';
import { Account } from '../../../entities/account';
import { Card } from '../../../entities/card';
import { CardList } from '../../../entities/card-list';
import { AccountList } from '../../../entities/account-list';
import { CardType } from '../../../entities/card-type';
import { AccountType } from '../../../entities/account-type';
import { Bank } from '../../../entities/bank';
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
  
  availableCardTypes: CardType[] = [];
  availableAccountTypes: AccountType[] = [];
  availableBanks: Bank[] = [];
  
  isLoadingCardTypes: boolean = false;
  isLoadingAccountTypes: boolean = false;
  isLoadingBanks: boolean = false;
  
  newCard: Card = new Card({
    carNumb: '',
    carLabe: '',
    carExpiryDate: undefined,
    cardType: undefined,
    carAmount: 0,
    carPlafond: undefined,
    carPlafondPeriod: undefined
  });
  
  newAccount: Account = new Account({
    accRib: '',
    accIden: '',
    accKey: '',
    accountType: undefined,
    bank: undefined,
    accBalance: undefined
  });

  constructor(
    private router: Router,
    private walletService: WalletService,
    private walletBalanceHistoryService: WalletBalanceHistoryService,
    private accountService: AccountService,
    private cardService: CardService,
    private cardListService: CardListService,
    private accountListService: AccountListService,
    private cardTypeService: CardTypeService,
    private accountTypeService: AccountTypeService,
    private bankService: BankService
  ) { }

  ngOnInit() {
    const cusCode = localStorage.getItem('cusCode');

    if (!cusCode) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadWallet(parseInt(cusCode));
    this.loadDropdownData();
  }

  loadDropdownData(): void {
    this.loadCardTypes();
    this.loadAccountTypes();
    this.loadBanks();
  }

  loadCardTypes(): void {
    this.isLoadingCardTypes = true;
    this.cardTypeService.findAll().subscribe({
      next: (cardTypes: CardType[]) => {
        this.availableCardTypes = cardTypes;
        this.isLoadingCardTypes = false;
      },
      error: (err) => {
        console.error('Failed to load card types', err);
        this.isLoadingCardTypes = false;
        this.availableCardTypes = [
          { ctypCode: 1, ctypLabe: 'visa' },
          { ctypCode: 2, ctypLabe: 'mastercard' }
        ];
      }
    });
  }

  loadAccountTypes(): void {
    this.isLoadingAccountTypes = true;
    this.accountTypeService.getAll().subscribe({
      next: (accountTypes: AccountType[]) => {
        this.availableAccountTypes = accountTypes;
        this.isLoadingAccountTypes = false;
      },
      error: (err) => {
        console.error('Failed to load account types', err);
        this.isLoadingAccountTypes = false;
        this.availableAccountTypes = [
          { atyCode: 1, atyLabe: 'checking' },
          { atyCode: 2, atyLabe: 'savings' }
        ];
      }
    });
  }

  loadBanks(): void {
    this.isLoadingBanks = true;
    this.bankService.getAll().subscribe({
      next: (banks: Bank[]) => {
        this.availableBanks = banks;
        this.isLoadingBanks = false;
      },
      error: (err) => {
        console.error('Failed to load banks', err);
        this.isLoadingBanks = false;
        this.availableBanks = [
          { banCode: 1, banCorpName: 'Bank A' },
          { banCode: 2, banCorpName: 'Bank B' },
          { banCode: 3, banCorpName: 'Bank C' }
        ];
      }
    });
  }

  loadWallet(cusCode: number): void {
    this.walletService.getWalletByCustomerCode(cusCode).subscribe({
      next: (data: Wallet) => {
        console.log('Raw wallet response:', data);

        this.wallet = data;

        if (!this.wallet.cardList) {
          this.wallet.cardList = new CardList({ cliLabe: 'My Cards', cards: [] });
        } else if (!this.wallet.cardList.cards) {
          this.wallet.cardList.cards = [];
        }

        if (!this.wallet.accountList) {
          this.wallet.accountList = new AccountList({ aliLabe: 'My Accounts', accounts: [] });
        } else if (!this.wallet.accountList.accounts) {
          this.wallet.accountList.accounts = [];
        }

        console.log('Wallet after initialization:', this.wallet);
        console.log('Accounts array:', this.wallet.accountList?.accounts);
        console.log('Cards array:', this.wallet.cardList?.cards);
      },
      error: (err) => {
        console.error('Failed to load wallet', err);
        this.wallet = new Wallet();
        this.wallet.cardList = new CardList({ cliLabe: 'My Cards', cards: [] });
        this.wallet.accountList = new AccountList({ aliLabe: 'My Accounts', accounts: [] });
      }
    });
  }

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

  goToQrCode() {
    this.router.navigate(['/wallet/qr-scanner']);
  }

  openAddCardModal(): void {
    this.newCard = new Card({
      carNumb: '',
      carLabe: '',
      carExpiryDate: undefined,
      cardType: undefined,
      carAmount: 0,
      carPlafond: undefined,
      carPlafondPeriod: undefined
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
      accBalance: undefined
    });
    this.showAddAccountModal = true;
  }

  closeAddAccountModal(): void {
    this.showAddAccountModal = false;
  }

  // UPDATED: Add duplicate validation for cards
  addCard(): void {
    if (!this.newCard.carNumb || !this.newCard.carLabe || !this.newCard.carExpiryDate || !this.newCard.cardType) {
      alert('Please fill all required fields');
      return;
    }

    const cleanedCardNumber = this.newCard.carNumb.replace(/\s/g, '');
    if (!/^\d{16,19}$/.test(cleanedCardNumber)) {
      alert('Card number must be 16-19 digits');
      return;
    }

    // Frontend duplicate check
    const existingCard = this.wallet?.cardList?.cards?.find(card => 
      card.carNumb?.replace(/\s/g, '') === cleanedCardNumber
    );
    
    if (existingCard) {
      alert('This card is already linked to your wallet');
      return;
    }

    const cardToCreate = {
      carNumb: cleanedCardNumber,
      carLabe: this.newCard.carLabe,
      carExpiryDate: this.newCard.carExpiryDate,
      cardType: this.newCard.cardType,
      carAmount: this.newCard.carAmount || 0,
      carPlafond: this.newCard.carPlafond || 5000,
      carPlafondPeriod: this.newCard.carPlafondPeriod || 'MONTH',
      cardList: this.wallet?.cardList?.cliCode ? { cliCode: this.wallet.cardList.cliCode } : undefined
    };

    this.cardService.create(cardToCreate).subscribe({
      next: (createdCard) => {
        if (!this.wallet) {
          this.wallet = new Wallet();
        }
        if (!this.wallet.cardList) {
          this.wallet.cardList = new CardList({ cliLabe: 'My Cards', cards: [] });
        }
        if (!this.wallet.cardList.cards) {
          this.wallet.cardList.cards = [];
        }
        this.wallet.cardList.cards.push(createdCard);
        this.closeAddCardModal();
        alert('Card added successfully!');
      },
      error: (err) => {
        console.error('Failed to add card', err);
        
        // Handle duplicate error from backend
        if (err.error?.message?.includes('already exists') || err.message?.includes('already exists')) {
          alert('This card number is already registered in the system');
        } else {
          alert('Failed to add card: ' + (err.error?.message || 'Unknown error'));
        }
      }
    });
  }

  // UPDATED: Add duplicate validation for accounts
  addAccount(): void {
    if (!this.newAccount.accRib || !this.newAccount.accKey || !this.newAccount.accountType || !this.newAccount.bank) {
      alert('Please fill all required fields');
      return;
    }

    if (!/^[A-Z0-9]{20,34}$/.test(this.newAccount.accRib)) {
      alert('RIB must be 20-34 alphanumeric characters (uppercase letters and numbers only)');
      return;
    }

    // Frontend duplicate check
    const existingAccount = this.wallet?.accountList?.accounts?.find(account => 
      account.accRib === this.newAccount.accRib
    );
    
    if (existingAccount) {
      alert('This account is already linked to your wallet');
      return;
    }

    const accountToCreate = {
      accRib: this.newAccount.accRib,
      accKey: this.newAccount.accKey,
      accountType: this.newAccount.accountType,
      bank: this.newAccount.bank,
      accBalance: this.newAccount.accBalance || 0.0,
      accountList: this.wallet?.accountList?.aliCode ? { aliCode: this.wallet.accountList.aliCode } : undefined
    };

    this.accountService.createAccount(accountToCreate).subscribe({
      next: (createdAccount) => {
        if (!this.wallet) {
          this.wallet = new Wallet();
        }
        if (!this.wallet.accountList) {
          this.wallet.accountList = new AccountList({ aliLabe: 'My Accounts', accounts: [] });
        }
        if (!this.wallet.accountList.accounts) {
          this.wallet.accountList.accounts = [];
        }
        this.wallet.accountList.accounts.push(createdAccount);
        this.closeAddAccountModal();
        alert('Account added successfully!');
      },
      error: (err) => {
        console.error('Failed to add account', err);
        
        // Handle duplicate error from backend
        if (err.error?.message?.includes('already exists') || err.message?.includes('already exists')) {
          alert('This RIB is already registered in the system');
        } else {
          alert('Failed to add account: ' + (err.error?.message || 'Unknown error'));
        }
      }
    });
  }
}