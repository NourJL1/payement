import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { WalletStatusService } from '../../../services/wallet-status.service';
import { WalletStatus } from '../../../entities/wallet-status';
import { WalletCategoryService } from '../../../services/wallet-category.service';
import { WalletCategory } from '../../../entities/wallet-category';
import { WalletTypeService } from '../../../services/wallet-type.service';
import { WalletType } from '../../../entities/wallet-type';
import { CardService } from '../../../services/card.service';
import { Card } from '../../../entities/card';
import { CardTypeService } from '../../../services/card-type.service';
import { CardType } from '../../../entities/card-type';
import { CardListService } from '../../../services/card-list.service';
import { CardList } from '../../../entities/card-list';
import { WalletService } from '../../../services/wallet.service';
import { Wallet } from '../../../entities/wallet';
import { AccountTypeService } from '../../../services/account-type.service';
import { AccountType } from '../../../entities/account-type';
import { error } from 'console';
import { filter } from 'rxjs';
import { Customer } from '../../../entities/customer';
import { AccountList } from '../../../entities/account-list';
import { AccountListService } from '../../../services/account-list.service';
import { Account } from '../../../entities/account';
import { Bank } from '../../../entities/bank';
import { AccountService } from '../../../services/account.service';
import { BankService } from '../../../services/bank.service';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-wallet-mng',
  imports: [CommonModule, FormsModule],
  templateUrl: './wallet-mng.component.html',
  styleUrls: ['./wallet-mng.component.css'],
  standalone: true
})
export class WalletMngComponent implements OnInit {

  addCard: boolean = false;
  addAccount: boolean = false;

  walletStatuses: WalletStatus[] = [];
  filteredStatuses: WalletStatus[] = [];
  isWalletStatusVisible: boolean = false;
  selectedStatus?: WalletStatus// = new WalletStatus();
  isStatusEditMode: boolean = false;

  walletCategories: WalletCategory[] = [];
  filteredWalletCategories: WalletCategory[] = [];
  isWalletCategoryVisible: boolean = false;
  selectedCategory?: WalletCategory// = new WalletCategory();
  isCategoryEditMode: boolean = false;

  walletTypesList: WalletType[] = [];
  filteredWalletTypes: WalletType[] = [];
  newWalletType?: WalletType// = new WalletType();
  selectedWalletType?: WalletType;
  isWalletTypeEditMode: boolean = false;
  isWalletTypeVisible: boolean = false;

  cardsList: Card[] = [];
  filteredCardsList: Card[] = []; // Added for filtered cards
  searchCardTerm: string = ''; // Added for search term
  newCard: Card = new Card({ cardList: new CardList({ wallet: new Wallet() }), cardType: new CardType() });
  selectedCard: Card | null = null;
  isCardEditMode: boolean = false;
  isCardFormVisible: boolean = false;

  cardTypesList: CardType[] = [];
  // Add these to your component properties
searchCardTypeTerm: string = '';
filteredCardTypesList: CardType[] = [];
  newCardType: CardType = new CardType();
  selectedCardType: CardType | null = null;
  isCardTypeEditMode: boolean = false;
  isCardTypeVisible: boolean = false;

  cardListsList: CardList[] = [];
  // Add these to your component properties
searchCardListTerm: string = '';
filteredCardListsList: CardList[] = [];
  newCardList: CardList = new CardList({ wallet: new Wallet() });
  selectedCardList: CardList | null = null;
  isCardListEditMode: boolean = false;
  isCardListVisible: boolean = false;

  walletsList: Wallet[] = [];
  selectedWallet: Wallet = new Wallet()

  accountTypesList: AccountType[] = [];
  searchAccountTypeTerm: string = '';
  filteredAccountTypesList: AccountType[] = [];
  newAccountType: AccountType = new AccountType();
  selectedAccountType: AccountType | null = null;
  isAccountTypeEditMode: boolean = false;
  isAccountTypeVisible: boolean = false;

  accountListsList: AccountList[] = [];
  searchAccountListTerm: string = '';
  filteredAccountListsList: AccountList[] = [];
  newAccountList: AccountList = new AccountList({ wallet: new Wallet() });
  selectedAccountList: AccountList | null = null;
  isAccountListEditMode: boolean = false;

  // Add these properties to your component class
accountsList: Account[] = [];
filteredAccountsList: Account[] = [];
searchAccountTerm: string = '';
newAccount: Account = new Account();
selectedAccount: Account | null = null;
isAccountEditMode: boolean = false;
banksList: Bank[] = []; // You'll need to create a BankService to fetch this

  errorMessage: string | null = null;
  successMessage: string | null = null;

  isWalletFormVisible: boolean = false;
  isWalletDetailsVisible: boolean = false;
  isAccountFormVisible: boolean = false;
  isAccountListVisible: boolean = false;

  walletCount: number = 0;
  lastUpdated: Date | null = null;

  // Filter variables
  searchTerm?: string;
  statusSearchTerm?: string;
  typeSearchTerm?: string;
  categorySearchTerm?: string;
  filteredWallets: Wallet[] = [];

showExportMenu: boolean = false;

  constructor(
    private walletStatusService: WalletStatusService,
    private walletCategoryService: WalletCategoryService,
    private walletTypeService: WalletTypeService,
    private cardService: CardService,
    private cardTypeService: CardTypeService,
    private cardListService: CardListService,
    private walletService: WalletService,
    private accountTypeService: AccountTypeService,
    private accountListService: AccountListService,
    private accountService: AccountService,
    private bankService: BankService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (history.state?.walletOwner) {  // <-- Check history.state
          const customer = history.state.walletOwner as number;
          //this.editCustomer(customer);
          this.walletService.getWalletByCustomerCode(customer).subscribe({
            next: (wallet: Wallet) => {
              this.selectedWallet = wallet
              this.toggleForm('wallet-details')
          history.replaceState({}, '');
            },
            error: (err) => {
              console.log("failed to get wallet by customer")
            }
          })
        }
    this.loadWalletStatuses();
    this.loadWalletCategories();
    this.loadWalletTypes();
    this.loadCards();
    this.loadCardTypes();
    this.loadCardLists();
    this.loadAccountTypes();
    this.loadAccountLists();
    this.loadWalletStats();
    this.loadWallets(); // this should internally fetch and assign to `wallets` and `filteredWallets`
    this.loadAccounts();
    this.loadBanks(); // Load banks for the bank dropdown in account form
  }


  private getHttpOptions(): { headers: HttpHeaders } {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role') || 'CUSTOMER';
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Roles': `ROLE_${role.toUpperCase()}`
    });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return { headers };
  }

  clearMessage(): void {
    // console.log('clearMessage: Clearing messages');
    this.successMessage = null;
    this.errorMessage = null;
    this.cdr.detectChanges();
  }

  toggleExportMenu(): void {
  this.showExportMenu = !this.showExportMenu;
}

exportData(format: 'pdf' | 'excel'): void {
  this.showExportMenu = false;
  
  if (format === 'pdf') {
    this.exportToPDF();
  } else {
    this.exportToExcel();
  }
}

private exportToExcel(): void {
  // Prepare data
  const data = this.filteredWallets.map(wallet => ({
    'Identifier': wallet.walIden,
    'Name': wallet.walLabe,
    'Created At': wallet.createdAt ? new Date(wallet.createdAt).toLocaleString() : '',
    'Status': wallet.walletStatus?.wstLabe || '',
    'Type': wallet.walletType?.wtyLabe || '',
    'Category': wallet.walletCategory?.wcaLabe || '',
    'Fin Id': wallet.walFinId || ''
  }));

  // Create worksheet
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  
  // Create workbook
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Wallets');
  
  // Generate file and download
  XLSX.writeFile(wb, 'wallets_export.xlsx');
}

private exportToPDF(): void {
  const doc = new jsPDF({
    orientation: 'landscape' // Optional: use 'portrait' if you prefer
  });

  // Add title
  doc.setFontSize(16);
  doc.setTextColor(40);
  doc.text('Wallet Management Report', 14, 16);

  // Prepare data
  const headers = [['Identifier', 'Name', 'Created At', 'Status', 'Type', 'Category', 'Fin Id']];
  
  const data = this.filteredWallets.map(wallet => [
    wallet.walIden || '',
    wallet.walLabe || '',
    wallet.createdAt ? new Date(wallet.createdAt).toLocaleString() : '',
    wallet.walletStatus?.wstLabe || '',
    wallet.walletType?.wtyLabe || '',
    wallet.walletCategory?.wcaLabe || '',
    wallet.walFinId || ''
  ]);

  // Add table
  autoTable(doc, {
    head: headers,
    body: data,
    startY: 25,
    theme: 'grid', // or 'striped', 'plain'
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
      overflow: 'linebreak'
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 30 },
      2: { cellWidth: 30 },
      3: { cellWidth: 20 },
      4: { cellWidth: 20 },
      5: { cellWidth: 20 },
      6: { cellWidth: 15 }
    }
  });

  // Save the PDF
  doc.save('wallets_export_' + new Date().toISOString().slice(0, 10) + '.pdf');
}
@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative.inline-block.text-left')) {
    this.showExportMenu = false;
  }
}


// Add these methods to your component class
loadBanks(): void {
  this.errorMessage = null;
  this.bankService.getAll().subscribe({
    next: (banks: Bank[]) => {
      this.banksList = banks;
      this.cdr.detectChanges();
    },
    error: (error: HttpErrorResponse) => {
      const message = error.status
        ? `Failed to load banks: ${error.status} ${error.statusText}`
        : 'Failed to load banks: Server error';
      this.showErrorMessage(message);
      console.error('Error loading banks:', error);
    }
  });
}
// Load accounts
loadAccounts(): void {
  this.errorMessage = null;
  this.accountService.getAllAccounts().subscribe({
    next: (accounts: Account[]) => {
      this.accountsList = accounts;
      this.filteredAccountsList = [...accounts];
      this.cdr.detectChanges();
    },
    error: (error: HttpErrorResponse) => {
      const message = error.status
        ? `Failed to load accounts: ${error.status} ${error.statusText}`
        : 'Failed to load accounts: Server error';
      this.showErrorMessage(message);
      console.error('Error loading accounts:', error);
    }
  });
}

// Search accounts
searchAccounts(): void {
  if (!this.searchAccountTerm || this.searchAccountTerm.trim() === '') {
    this.filteredAccountsList = [...this.accountsList];
  } else {
    const searchTerm = this.searchAccountTerm.toLowerCase().trim();
    this.filteredAccountsList = this.accountsList.filter(account => {
      return (
        (account.accCode?.toString().includes(searchTerm)) ||
        (account.accIden?.toLowerCase().includes(searchTerm)) ||
        (account.accRib?.toLowerCase().includes(searchTerm)) ||
        (account.accountList?.aliLabe?.toLowerCase().includes(searchTerm)) ||
        (account.accountType?.atyLabe?.toLowerCase().includes(searchTerm)) ||
        (account.bank?.banCorpName?.toLowerCase().includes(searchTerm))
      );
    });
  }
  this.cdr.detectChanges();
}

// Save account (create or update)
saveAccount(): void {
  this.errorMessage = null;
  if (!this.newAccount.accountList || !this.newAccount.accountType || !this.newAccount.bank) {
    this.showErrorMessage('Please fill in all required fields: List, Type, and Bank.');
    return;
  }

  const accountPayload: Account = {
    accIden: this.newAccount.accIden,
    accRib: this.newAccount.accRib,
    accKey: this.newAccount.accKey,
    accountList: this.newAccount.accountList,
    accountType: this.newAccount.accountType,
    bank: this.newAccount.bank
  };

  if (this.isAccountEditMode && this.selectedAccount?.accCode) {
    this.accountService.updateAccount(this.selectedAccount.accCode, accountPayload).subscribe({
      next: (updatedAccount: Account) => {
        const index = this.accountsList.findIndex(a => a.accCode === updatedAccount.accCode);
        if (index !== -1) {
          this.accountsList[index] = updatedAccount;
          this.accountsList = [...this.accountsList];
        }
        this.newAccount = new Account();
        this.selectedAccount = null;
        this.isAccountEditMode = false;
        this.isAccountFormVisible = false;
        this.showSuccessMessage('Account updated successfully');
        this.searchAccounts();
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.status
          ? `Failed to update account: ${error.status} ${error.statusText}`
          : 'Failed to update account: Server error';
        this.showErrorMessage(message);
        console.error('Error updating account:', error);
      }
    });
  } else {
    this.accountService.createAccount(accountPayload).subscribe({
      next: (createdAccount: Account) => {
        this.accountsList.push(createdAccount);
        this.newAccount = new Account();
        this.isAccountFormVisible = false;
        this.showSuccessMessage('Account added successfully');
        this.searchAccounts();
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.status
          ? `Failed to create account: ${error.status} ${error.statusText}`
          : 'Failed to create account: Server error';
        this.showErrorMessage(message);
        console.error('Error creating account:', error);
      }
    });
  }
}

// Edit account
editAccount(account: Account): void {
  this.errorMessage = null;
  this.selectedAccount = account;
  this.newAccount = { 
    ...account,
    accountList: account.accountList ? { ...account.accountList } : undefined,
    accountType: account.accountType ? { ...account.accountType } : undefined,
    bank: account.bank ? { ...account.bank } : undefined
  };
  this.isAccountEditMode = true;
  this.isAccountFormVisible = true;
  this.cdr.detectChanges();
}

// Delete account
// Delete account
deleteAccount(accCode: number | undefined): void {
  this.errorMessage = null;
  if (accCode && confirm('Are you sure you want to delete this account?')) {
    this.accountService.deleteAccount(accCode).subscribe({
      next: () => {
        this.accountsList = this.accountsList.filter(a => a.accCode !== accCode);
        this.searchAccounts();
        this.showSuccessMessage('Account deleted successfully');
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.status
          ? `Failed to delete account: ${error.status} ${error.statusText}`
          : 'Failed to delete account: Server error';
        this.showErrorMessage(message);
        console.error('Error deleting account:', error);
      }
    });
  }
}

// Don't forget to call loadAccounts() in your ngOnInit()

  // Load account lists
  loadAccountLists(): void {
    this.errorMessage = null;
    this.accountListService.getAll().subscribe({
      next: (accountLists: AccountList[]) => {
        this.accountListsList = accountLists;
        this.filteredAccountListsList = [...accountLists];
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.status
          ? `Failed to load account lists: ${error.status} ${error.statusText}`
          : 'Failed to load account lists: Server error';
        this.showErrorMessage(message);
        console.error('Error loading account lists:', error);
      }
    });
  }

  // Search account lists
  searchAccountLists(): void {
    console.log('Search term:', this.searchAccountListTerm);
    if (!this.searchAccountListTerm || this.searchAccountListTerm.trim() === '') {
      this.filteredAccountListsList = [...this.accountListsList];
      this.cdr.detectChanges();
    } else {
      this.accountListService.searchAccountLists(this.searchAccountListTerm).subscribe({
        next: (searchResults: AccountList[]) => {
          console.log('Search results:', searchResults);
          this.filteredAccountListsList = searchResults;
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          const message = error.status
            ? `Failed to search account lists: ${error.status} ${error.statusText}`
            : 'Failed to search account lists: Server error';
          this.showErrorMessage(message);
          console.error('Error searching account lists:', error);
        }
      });
    }
  }

  // Save account list
  saveAccountList(): void {
    this.errorMessage = null;
    if (!this.newAccountList.aliLabe) {
      this.showErrorMessage('Please fill in the required field: List Label.');
      return;
    }
    const accountListPayload: AccountList = {
      aliLabe: this.newAccountList.aliLabe,
      aliIden: this.newAccountList.aliIden || this.selectedAccountList?.aliIden,
      wallet: this.newAccountList.wallet ? { walIden: this.newAccountList.wallet.walIden } : null,
      accounts: this.newAccountList.accounts || []
    };
    if (this.isAccountListEditMode && this.selectedAccountList?.aliCode) {
      this.accountListService.update(this.selectedAccountList.aliCode, accountListPayload).subscribe({
        next: (updatedAccountList: AccountList) => {
          const index = this.accountListsList.findIndex(l => l.aliCode === updatedAccountList.aliCode);
          if (index !== -1) {
            this.accountListsList[index] = updatedAccountList;
            this.accountListsList = [...this.accountListsList];
          }
          this.newAccountList = new AccountList({ wallet: new Wallet() });
          this.selectedAccountList = null;
          this.isAccountListEditMode = false;
          this.isAccountListVisible = false;
          this.showSuccessMessage('Account list updated successfully');
          this.searchAccountLists();
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          const message = error.status
            ? `Failed to update account list: ${error.status} ${error.statusText}`
            : 'Failed to update account list: Server error';
          this.showErrorMessage(message);
          console.error('Error updating account list:', error);
        }
      });
    } else {
      this.accountListService.create(accountListPayload).subscribe({
        next: (createdAccountList: AccountList) => {
          this.accountListsList.push(createdAccountList);
          this.newAccountList = new AccountList({ wallet: new Wallet() });
          this.isAccountListVisible = false;
          this.showSuccessMessage('Account list added successfully');
          this.searchAccountLists();
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          const message = error.status
            ? `Failed to create account list: ${error.status} ${error.statusText}`
            : 'Failed to create account list: Server error';
          this.showErrorMessage(message);
          console.error('Error creating account list:', error);
        }
      });
    }
  }

  // Edit account list
  editAccountList(accountList: AccountList): void {
    this.errorMessage = null;
    this.selectedAccountList = accountList;
    this.newAccountList = { ...accountList, wallet: accountList.wallet ? { ...accountList.wallet } : new Wallet() };
    this.isAccountListEditMode = true;
    this.isAccountListVisible = true;
    this.cdr.detectChanges();
  }

  // Delete account list
  deleteAccountList(aliCode: number | undefined): void {
    this.errorMessage = null;
    if (aliCode && confirm('Are you sure you want to delete this account list?')) {
      this.accountListService.delete(aliCode).subscribe({
        next: () => {
          this.accountListsList = this.accountListsList.filter(l => l.aliCode !== aliCode);
          this.searchAccountLists();
          this.showSuccessMessage('Account list deleted successfully');
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          const message = error.status
            ? `Failed to delete account list: ${error.status} ${error.statusText}`
            : 'Failed to delete account list: Server error';
          this.showErrorMessage(message);
          console.error('Error deleting account list:', error);
        }
      });
    }
  }

  searchStatus() {
    if (!this.statusSearchTerm)
      this.filteredStatuses = this.walletStatuses
    else {
      this.walletStatusService.search(this.statusSearchTerm).subscribe({
        next: (searchResults: WalletStatus[]) => {
          this.filteredStatuses = searchResults;
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          this.showErrorMessage(`Failed to search wallet statuses: ${error.status} ${error.statusText}`);
        }
      })
    }
  }

searchCards(): void {
  console.log('Search term:', this.searchCardTerm);
  if (!this.searchCardTerm) {
    this.filteredCardsList = [...this.cardsList];
    this.cdr.detectChanges();
  } else {
    this.cardService.searchCards(this.searchCardTerm).subscribe({
      next: (searchResults: Card[]) => {
        console.log('Search results:', searchResults);
        this.filteredCardsList = searchResults;
        setTimeout(() => {
          this.cdr.markForCheck(); // Mark for check instead of detectChanges
        }, 0);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Search error:', error);
        const message = error.status
          ? `Failed to search cards: ${error.status} ${error.statusText}`
          : 'Failed to search cards: Server error';
        this.showErrorMessage(message);
      }
    });
  }
}

  searchType() {
    if (!this.typeSearchTerm)
      this.filteredWalletTypes = this.walletTypesList
    else {
      this.walletTypeService.search(this.typeSearchTerm).subscribe({
        next: (searchResults: WalletType[]) => {
          this.filteredWalletTypes = searchResults;
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          this.showErrorMessage(`Failed to search wallet statuses: ${error.status} ${error.statusText}`);
        }
      })
    }
  }

  searchCategory() {
    if (!this.categorySearchTerm)
      this.filteredWalletCategories = this.walletCategories
    else {
      this.walletCategoryService.search(this.categorySearchTerm).subscribe({
        next: (searchResults: WalletCategory[]) => {
          this.filteredWalletCategories = searchResults;
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          this.showErrorMessage(`Failed to search wallet statuses: ${error.status} ${error.statusText}`);
        }
      })
    }
  }

  searchCardTypes(): void {
  console.log('Search term:', this.searchCardTypeTerm);
  if (!this.searchCardTypeTerm || this.searchCardTypeTerm.trim() === '') {
    this.filteredCardTypesList = [...this.cardTypesList];
    this.cdr.detectChanges();
  } else {
    this.cardTypeService.searchCardTypes(this.searchCardTypeTerm).subscribe({
      next: (searchResults: CardType[]) => {
        console.log('Search results:', searchResults);
        this.filteredCardTypesList = searchResults;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Search error:', error);
        const message = error.status
          ? `Failed to search card types: ${error.status} ${error.statusText}`
          : 'Failed to search card types: Server error';
        this.showErrorMessage(message);
      }
    });
  }
}

searchCardLists(): void {
  console.log('Search term:', this.searchCardListTerm);
  if (!this.searchCardListTerm || this.searchCardListTerm.trim() === '') {
    this.filteredCardListsList = [...this.cardListsList];
    this.cdr.detectChanges();
  } else {
    this.cardListService.searchCardLists(this.searchCardListTerm).subscribe({
      next: (searchResults: CardList[]) => {
        console.log('Search results:', searchResults);
        this.filteredCardListsList = searchResults;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Search error:', error);
        const message = error.status
          ? `Failed to search card lists: ${error.status} ${error.statusText}`
          : 'Failed to search card lists: Server error';
        this.showErrorMessage(message);
      }
    });
  }
}

searchAccountTypes(): void {
  console.log('Search term:', this.searchAccountTypeTerm);
  if (!this.searchAccountTypeTerm || this.searchAccountTypeTerm.trim() === '') {
    this.filteredAccountTypesList = [...this.accountTypesList]; // Show all when search is empty
    this.cdr.detectChanges();
  } else {
    this.accountTypeService.searchAccountTypes(this.searchAccountTypeTerm).subscribe({
      next: (searchResults: AccountType[]) => {
        console.log('Search results:', searchResults);
        this.filteredAccountTypesList = searchResults;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Search error:', error);
        const message = error.status
          ? `Failed to search account types: ${error.status} ${error.statusText}`
          : 'Failed to search account types: Server error';
        this.showErrorMessage(message);
      }
    });
  }
}

  applyFilters(): void {
    if (!this.selectedStatus && !this.selectedWalletType && !this.selectedCategory && !this.searchTerm)
      this.filteredWallets = this.walletsList;
    else {
      this.filteredWallets = this.walletsList!.filter(wallet => {
        return (!this.selectedStatus || this.selectedStatus?.wstCode === wallet.walletStatus!.wstCode) &&
          (!this.selectedWalletType || this.selectedWalletType?.wtyCode === wallet.walletType!.wtyCode) &&
          (!this.selectedCategory! || this.selectedCategory?.wcaCode === wallet.walletCategory!.wcaCode);
      })
    }
    if (this.searchTerm) {
      this.walletService.search(this.searchTerm).subscribe({
        next: (searchResults: Wallet[]) => {
          this.filteredWallets = searchResults.filter(searchedWallet =>
            this.filteredWallets.some(localWallet => localWallet.walCode === searchedWallet.walCode)
          );
          //this.filteredWallets = this.filteredWallets.filter(wallet => {return searchResults.some(sr => sr.walCode === wallet.walCode)});
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          const message = error.status ? `Failed to search wallets: ${error.status} ${error.statusText}` : 'Failed to search wallets: Server error';
          this.showErrorMessage(message);
          console.error('Error searching wallets:', error);
        }
      })
    }
  }


  

  loadWalletStats(): void {
    this.errorMessage = null;
    // console.log('loadWalletStats: Fetching wallet count and last updated date...');
    this.walletService.getWalletCount().subscribe({
      next: (count: number) => {
        // console.log('loadWalletStats: Wallet count received:', count);
        this.walletCount = count;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.status ? `Failed to load wallet count: ${error.status} ${error.statusText}` : 'Failed to load wallet count: Server error';
        this.showErrorMessage(message);
        console.error('Error loading wallet count:', error);
      }
    });

    this.walletService.getAll().subscribe({
      next: (wallets: Wallet[]) => {
        const latestWallet = wallets.reduce((latest, wallet) => {
          const walletDate = wallet.lastUpdatedDate ? new Date(wallet.lastUpdatedDate) : null;
          if (!latest || !walletDate) return latest;
          return walletDate > latest ? walletDate : latest;
        }, null as Date | null);
        this.lastUpdated = latestWallet;
        // console.log('loadWalletStats: Last updated date:', this.lastUpdated);
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.status ? `Failed to load wallets for last updated date: ${error.status} ${error.statusText}` : 'Failed to load wallets: Server error';
        this.showErrorMessage(message);
        console.error('Error loading wallets for last updated date:', error);
      }
    });
  }

  // Load account types
loadAccountTypes(): void {
  this.searchAccountTypeTerm = ''; // Reset search term
  this.errorMessage = null;
  this.accountTypeService.getAll().subscribe({
    next: (accountTypes: AccountType[]) => {
      this.accountTypesList = accountTypes;
      this.filteredAccountTypesList = [...accountTypes]; // Initialize filtered list
      this.cdr.detectChanges();
    },
    error: (error: HttpErrorResponse) => {
      const message = error.status ? `Failed to load account types: ${error.status} ${error.statusText}` : 'Failed to load account types: Server error';
      this.showErrorMessage(message);
      console.error('Error loading account types:', error);
    }
  });
}

  // Save account type
saveAccountType(): void {
  this.errorMessage = null;
  if (!this.newAccountType.atyLabe || !this.newAccountType.atyFinId) {
    this.showErrorMessage('Please fill in all required fields: Type Label, and Financial Institution ID.');
    return;
  }
  if (this.isAccountTypeEditMode && this.selectedAccountType?.atyCode) {
    this.accountTypeService.update(this.selectedAccountType.atyCode, this.newAccountType).subscribe({
      next: (updatedAccountType: AccountType) => {
        const index = this.accountTypesList.findIndex(t => t.atyCode === updatedAccountType.atyCode);
        if (index !== -1) {
          this.accountTypesList[index] = updatedAccountType;
          this.accountTypesList = [...this.accountTypesList];
        }
        // Update filtered list
        const filteredIndex = this.filteredAccountTypesList.findIndex(t => t.atyCode === updatedAccountType.atyCode);
        if (filteredIndex !== -1) {
          this.filteredAccountTypesList[filteredIndex] = updatedAccountType;
          this.filteredAccountTypesList = [...this.filteredAccountTypesList];
        }
        this.newAccountType = new AccountType();
        this.selectedAccountType = null;
        this.isAccountTypeEditMode = false;
        this.isAccountTypeVisible = false;
        this.showSuccessMessage('Account type updated successfully');
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.status ? `Failed to update account type: ${error.status} ${error.statusText}` : 'Failed to update account type: Server error';
        this.showErrorMessage(message);
        console.error('Error updating account type:', error);
      }
    });
  } else {
    this.accountTypeService.create(this.newAccountType).subscribe({
      next: (createdAccountType: AccountType) => {
        this.accountTypesList.push(createdAccountType);
        this.filteredAccountTypesList.push(createdAccountType); // Add this line
        this.newAccountType = new AccountType();
        this.isAccountTypeVisible = false;
        this.showSuccessMessage('Account type added successfully');
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.status ? `Failed to create account type: ${error.status} ${error.statusText}` : 'Failed to create account type: Server error';
        this.showErrorMessage(message);
        console.error('Error creating account type:', error);
      }
    });
  }
}

  // Edit account type
  editAccountType(accountType: AccountType): void {
    this.errorMessage = null;
    // console.log('editAccountType: Editing account type:', accountType);
    this.selectedAccountType = accountType;
    this.newAccountType = { ...accountType };
    this.isAccountTypeEditMode = true;
    this.isAccountTypeVisible = true;
    this.cdr.detectChanges();
  }

  // Delete account type
  deleteAccountType(atyCode: number | undefined): void {
  this.errorMessage = null;
  if (atyCode && confirm('Are you sure you want to delete this account type?')) {
    this.accountTypeService.delete(atyCode).subscribe({
      next: () => {
        this.accountTypesList = this.accountTypesList.filter(t => t.atyCode !== atyCode);
        this.filteredAccountTypesList = this.filteredAccountTypesList.filter(t => t.atyCode !== atyCode); // Add this line
        this.showSuccessMessage('Account type deleted successfully');
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.status ? `Failed to delete account type: ${error.status} ${error.statusText}` : 'Failed to delete account type: Server error';
        this.showErrorMessage(message);
        console.error('Error deleting account type:', error);
      }
    });
  }
}

  // Load wallet statuses
  loadWalletStatuses(): void {
    this.errorMessage = null;
    // console.log('loadWalletStatuses: Fetching wallet statuses...');
    this.walletStatusService.getAll(this.getHttpOptions()).subscribe({
      next: (statuses: WalletStatus[]) => {
        // console.log('loadWalletStatuses: Wallet statuses received:', statuses);
        this.walletStatuses = statuses;
        this.filteredStatuses = [...this.walletStatuses]; // ✅ corrected here
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.status ? `Failed to load wallet statuses: ${error.status} ${error.statusText}` : 'Failed to load wallet statuses: Server error';
        this.showErrorMessage(message);
        console.error('Error loading wallet statuses:', error);
      }
    });
  }

  // Load wallet categories
  loadWalletCategories(): void {
    this.errorMessage = null;
    // console.log('loadWalletCategories: Fetching wallet categories...');
    this.walletCategoryService.getAll(this.getHttpOptions()).subscribe({
      next: (categories: WalletCategory[]) => {
        // console.log('loadWalletCategories: Wallet categories received:', categories);
        this.walletCategories = categories;
        this.filteredWalletCategories = [...this.walletCategories]; // ✅ corrected here
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.status ? `Failed to load wallet categories: ${error.status} ${error.statusText}` : 'Failed to load wallet categories: Server error';
        this.showErrorMessage(message);
        console.error('Error loading wallet categories:', error);
      }
    });
  }

  // Load wallet types
  loadWalletTypes(): void {
    this.errorMessage = null;
    // console.log('loadWalletTypes: Fetching wallet types...');
    this.walletTypeService.getAll(this.getHttpOptions()).subscribe({
      next: (types: WalletType[]) => {
        // console.log('loadWalletTypes: Wallet types received:', types);
        this.walletTypesList = types;
        this.filteredWalletTypes = this.walletTypesList; // ✅ corrected here
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.status ? `Failed to load wallet types: ${error.status} ${error.statusText}` : 'Failed to load wallet types: Server error';
        this.showErrorMessage(message);
        console.error('Error loading wallet types:', error);
      }
    });
  }

  // Load cards
  loadCards(): void {
  this.errorMessage = null;
  this.cardService.getAll().subscribe({
    next: (cards: Card[]) => {
      this.cardsList = cards;
      this.filteredCardsList = [...cards]; // Ensure filteredCardsList is initialized
      console.log('Loaded cards:', this.cardsList);
      console.log('Initialized filteredCardsList:', this.filteredCardsList);
      this.cdr.detectChanges();
    },
    error: (error: HttpErrorResponse) => {
      const message = error.status
        ? `Failed to load cards: ${error.status} ${error.statusText}`
        : 'Failed to load cards: Server error';
      this.showErrorMessage(message);
      console.error('Error loading cards:', error);
    }
  });
}

  // Load card types
  loadCardTypes(): void {
  this.errorMessage = null;
  this.cardTypeService.findAll().subscribe({
    next: (cardTypes: CardType[]) => {
      this.cardTypesList = cardTypes;
      this.filteredCardTypesList = [...cardTypes]; // Initialize filtered list
      this.cdr.detectChanges();
    },
    error: (error: HttpErrorResponse) => {
      const message = error.status 
        ? `Failed to load card types: ${error.status} ${error.statusText}`
        : 'Failed to load card types: Server error';
      this.showErrorMessage(message);
      console.error('Error loading card types:', error);
    }
  });
}

  // Load card lists
  loadCardLists(): void {
  this.errorMessage = null;
  this.cardListService.getAll().subscribe({
    next: (cardLists: CardList[]) => {
      this.cardListsList = cardLists;
      this.filteredCardListsList = [...cardLists]; // Initialize filtered list
      this.cdr.detectChanges();
    },
    error: (error: HttpErrorResponse) => {
      const message = error.status 
        ? `Failed to load card lists: ${error.status} ${error.statusText}`
        : 'Failed to load card lists: Server error';
      this.showErrorMessage(message);
      console.error('Error loading card lists:', error);
    }
  });
}

  // Load wallets
  loadWallets(): void {
    this.errorMessage = null;
    // console.log('loadWallets: Fetching wallets...');
    this.walletService.getAll().subscribe({
      next: (wallets: Wallet[]) => {
        // console.log('loadWallets: Wallets received:', wallets);
        this.walletsList = wallets;
        this.filteredWallets = [...this.walletsList]; // ✅ corrected here
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.status
          ? `Failed to load wallets: ${error.status} ${error.statusText}`
          : 'Failed to load wallets: Server error';
        this.showErrorMessage(message);
        console.error('Error loading wallets:', error);
      }
    });
  }

editWallet(wallet: Wallet): void {
    this.errorMessage = null;
    this.selectedWallet = {
      ...wallet,
      walletStatus: wallet.walletStatus ? { ...wallet.walletStatus } : new WalletStatus(),
      walletType: wallet.walletType ? { ...wallet.walletType } : new WalletType(),
      walletCategory: wallet.walletCategory ? { ...wallet.walletCategory } : new WalletCategory(),
      walFinId: wallet.walFinId // Ensure Financial ID is included
    };
    this.isWalletFormVisible = true;
    this.isWalletDetailsVisible = false;
    this.cdr.detectChanges();
  }

saveWallet(): void {
  this.errorMessage = null;
  if (!this.selectedWallet.walletStatus?.wstCode || !this.selectedWallet.walletType?.wtyCode || 
      !this.selectedWallet.walletCategory?.wcaCode || !this.selectedWallet.walFinId) {
    this.showErrorMessage('Please select all required fields: Status, Type, Category, and Financial ID.');
    return;
  }

  const walletPayload: Wallet = {
    walIden: this.selectedWallet.walIden,
    walLabe: this.selectedWallet.walLabe,
    walFinId: this.selectedWallet.walFinId,
    walletStatus: {
      wstCode: this.selectedWallet.walletStatus.wstCode,
      wstIden: this.selectedWallet.walletStatus.wstIden,
      wstLabe: this.selectedWallet.walletStatus.wstLabe
    },
    walletType: {
      wtyCode: this.selectedWallet.walletType.wtyCode,
      wtyIden: this.selectedWallet.walletType.wtyIden,
      wtyLabe: this.selectedWallet.walletType.wtyLabe
    },
    walletCategory: {
      wcaCode: this.selectedWallet.walletCategory.wcaCode,
      wcaIden: this.selectedWallet.walletCategory.wcaIden,
      wcaLabe: this.selectedWallet.walletCategory.wcaLabe,
      wcaFinId: this.selectedWallet.walletCategory.wcaFinId
    },
    customer: this.selectedWallet.customer ? { 
      cusCode: this.selectedWallet.customer.cusCode,
      cusIden: this.selectedWallet.customer.cusIden,
      fullName: this.selectedWallet.customer.fullName,
      cusMailAddress: this.selectedWallet.customer.cusMailAddress,
      cusPhoneNbr: this.selectedWallet.customer.cusPhoneNbr
      // Include any other customer properties you need
    } : undefined,
    walEffBal: this.selectedWallet.walEffBal,
    walLogicBalance: this.selectedWallet.walLogicBalance,
    walSpecificBalance: this.selectedWallet.walSpecificBalance
  };
  if (this.selectedWallet.walCode) {
    this.walletService.update(this.selectedWallet.walCode, walletPayload).subscribe({
      next: (updatedWallet: Wallet) => {
        // Create a deep merge function to properly update the wallet
        const deepMergeWallet = (existing: Wallet, updated: Wallet): Wallet => {
  return {
    ...existing,
    ...updated,
    walletStatus: existing.walletStatus,
    walletType: existing.walletType,
    walletCategory: existing.walletCategory,
    customer: existing.customer, // Preserve the original customer
    createdAt: existing.createdAt, // Preserve the original createdAt
    lastUpdatedDate: updatedWallet.lastUpdatedDate || existing.lastUpdatedDate
  };
};

        // Update walletsList
        const walletIndex = this.walletsList.findIndex(w => w.walCode === updatedWallet.walCode);
        if (walletIndex !== -1) {
          this.walletsList[walletIndex] = deepMergeWallet(this.walletsList[walletIndex], updatedWallet);
          this.walletsList = [...this.walletsList]; // Create new array reference
        }

        // Update filteredWallets
        const filteredIndex = this.filteredWallets.findIndex(w => w.walCode === updatedWallet.walCode);
        if (filteredIndex !== -1) {
          this.filteredWallets[filteredIndex] = deepMergeWallet(this.filteredWallets[filteredIndex], updatedWallet);
          this.filteredWallets = [...this.filteredWallets]; // Create new array reference
        }

        this.isWalletFormVisible = false;
        this.selectedWallet = new Wallet();
        this.showSuccessMessage('Wallet updated successfully');
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.status
          ? `Failed to update wallet: ${error.status} ${error.statusText}`
          : 'Failed to update wallet: Server error';
        this.showErrorMessage(message);
        console.error('Error updating wallet:', error);
      }
    });
  }
}
  deleteWallet(wallet: Wallet) {
    this.errorMessage = null;
    if (wallet.walCode && confirm('Are you sure you want to delete this wallet?')) {
      this.walletService.delete(wallet.walCode).subscribe({
        next: () => {
          this.walletsList = this.walletsList.filter(w => w.walCode !== wallet.walCode);
          this.filteredWallets = this.filteredWallets.filter(w => w.walCode !== wallet.walCode);
          this.showSuccessMessage('Wallet deleted successfully');
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          const message = error.status ? `Failed to delete wallet: ${error.status} ${error.statusText}` : 'Failed to delete wallet: Server error';
          this.showErrorMessage(message);
          console.error('Error deleting wallet:', error);
        }
      });
    }
  }

changeWalletStatus(): void {
    this.errorMessage = null;
    console.log('changeWalletStatus: Opening status change form for wallet:', this.selectedWallet);
    this.isWalletStatusVisible = true;
    this.isStatusEditMode = true;
    this.selectedStatus = this.selectedWallet.walletStatus || new WalletStatus();
    this.cdr.detectChanges();
  }


  // Add or update card
  saveCard(): void {
  this.errorMessage = null;
  if (!this.newCard.carLabe || !this.newCard.carNumb || !this.newCard.carExpiryDate || !this.newCard.cardType?.ctypCode || !this.newCard.cardList?.cliCode) {
    this.showErrorMessage('Please fill in all required fields: Label, Number, Expiry Date, Card Type, and Card List.');
    return;
  }
  if (this.isCardEditMode && this.selectedCard?.carCode) {
    this.cardService.update(this.selectedCard.carCode, this.newCard).subscribe({
      next: (updatedCard: Card) => {
        const index = this.cardsList.findIndex(c => c.carCode === updatedCard.carCode);
        if (index !== -1) {
          this.cardsList[index] = updatedCard;
          this.cardsList = [...this.cardsList]; // Trigger change detection
        }
        this.newCard = new Card({ cardList: new CardList({ wallet: new Wallet() }), cardType: new CardType() });
        this.selectedCard = null;
        this.isCardEditMode = false;
        this.isCardFormVisible = false;
        this.showSuccessMessage('Card updated successfully');
        this.searchCards(); // Reapply search to update filteredCardsList
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.status ? `Failed to update card: ${error.status} ${error.statusText}` : 'Failed to update card: Server error';
        this.showErrorMessage(message);
        console.error('Error updating card:', error);
      }
    });
  } else {
    this.cardService.create(this.newCard).subscribe({
      next: (createdCard: Card) => {
        this.cardsList.push(createdCard);
        this.newCard = new Card({ cardList: new CardList({ wallet: new Wallet() }), cardType: new CardType() });
        this.isCardFormVisible = false;
        this.showSuccessMessage('Card added successfully');
        this.searchCards(); // Reapply search to update filteredCardsList
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.status ? `Failed to create card: ${error.status} ${error.statusText}` : 'Failed to create card: Server error';
        this.showErrorMessage(message);
        console.error('Error creating card:', error);
      }
    });
  }
}

  // Edit card
  editCard(card: Card): void {
    this.errorMessage = null;
    // console.log('editCard: Editing card:', card);
    this.selectedCard = card;
    this.newCard = {
      ...card,
      cardType: card.cardType ? { ...card.cardType } : new CardType(),
      cardList: card.cardList ? { ...card.cardList, wallet: card.cardList.wallet ? { ...card.cardList.wallet } : new Wallet() } : new CardList({ wallet: new Wallet() })
    };
    this.isCardEditMode = true;
    this.isCardFormVisible = true;
    this.cdr.detectChanges();
  }

  // Delete card
  deleteCard(carCode: number | undefined): void {
  this.errorMessage = null;
  if (carCode && confirm('Are you sure you want to delete this card?')) {
    this.cardService.delete(carCode).subscribe({
      next: () => {
        this.cardsList = this.cardsList.filter(c => c.carCode !== carCode);
        this.searchCards(); // Reapply search to update filteredCardsList
        this.showSuccessMessage('Card deleted successfully');
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.status ? `Failed to delete card: ${error.status} ${error.statusText}` : 'Failed to delete card: Server error';
        this.showErrorMessage(message);
        console.error('Error deleting card:', error);
      }
    });
  }
}

  // Add or update card type
  saveCardType(): void {
  this.errorMessage = null;
  if (!this.newCardType.ctypLabe) {
    this.showErrorMessage('Please fill in all required fields: Label.');
    return;
  }
  if (this.isCardTypeEditMode && this.selectedCardType?.ctypCode) {
    this.cardTypeService.save(this.newCardType).subscribe({
      next: (updatedCardType: CardType) => {
        const index = this.cardTypesList.findIndex(t => t.ctypCode === updatedCardType.ctypCode);
        if (index !== -1) {
          this.cardTypesList[index] = updatedCardType;
          this.cardTypesList = [...this.cardTypesList];
        }
        this.newCardType = new CardType();
        this.selectedCardType = null;
        this.isCardTypeEditMode = false;
        this.isCardTypeVisible = false;
        this.showSuccessMessage('Card type updated successfully');
        this.searchCardTypes(); // Reapply search to update filteredCardTypesList
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.status ? `Failed to update card type: ${error.status} ${error.statusText}` : 'Failed to update card type: Server error';
        this.showErrorMessage(message);
        console.error('Error updating card type:', error);
      }
    });
  } else {
    this.cardTypeService.save(this.newCardType).subscribe({
      next: (createdCardType: CardType) => {
        this.cardTypesList.push(createdCardType);
        this.newCardType = new CardType();
        this.isCardTypeVisible = false;
        this.showSuccessMessage('Card type added successfully');
        this.searchCardTypes(); // Reapply search to update filteredCardTypesList
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.status ? `Failed to create card type: ${error.status} ${error.statusText}` : 'Failed to create card type: Server error';
        this.showErrorMessage(message);
        console.error('Error creating card type:', error);
      }
    });
  }
}

  // Edit card type
  editCardType(cardType: CardType): void {
    this.errorMessage = null;
    // console.log('editCardType: Editing card type:', cardType);
    this.selectedCardType = cardType;
    this.newCardType = { ...cardType };
    this.isCardTypeEditMode = true;
    this.isCardTypeVisible = true;
    this.cdr.detectChanges();
  }

  // Delete card type
  deleteCardType(ctypCode: number | undefined): void {
  this.errorMessage = null;
  if (ctypCode && confirm('Are you sure you want to delete this card type?')) {
    this.cardTypeService.deleteById(ctypCode).subscribe({
      next: () => {
        this.cardTypesList = this.cardTypesList.filter(t => t.ctypCode !== ctypCode);
        this.searchCardTypes(); // Reapply search to update filteredCardTypesList
        this.showSuccessMessage('Card type deleted successfully');
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.status ? `Failed to delete card type: ${error.status} ${error.statusText}` : 'Failed to delete card type: Server error';
        this.showErrorMessage(message);
        console.error('Error deleting card type:', error);
      }
    });
  }
}

  // Add or update card list
saveCardList(): void {
  this.errorMessage = null;
  if (!this.newCardList.cliLabe || !this.newCardList.wallet?.walIden) {
    this.showErrorMessage('Please fill in all required fields: Label and Wallet.');
    return;
  }
  const cardListPayload: CardList = {
    cliLabe: this.newCardList.cliLabe,
    cliIden: this.newCardList.cliIden || this.selectedCardList?.cliIden,
    wallet: { walIden: this.newCardList.wallet.walIden },
    cards: this.newCardList.cards || []
  };
  console.log('Payload being sent:', JSON.stringify(cardListPayload, null, 2));
  if (this.isCardListEditMode && this.selectedCardList?.cliCode) {
    this.cardListService.update(this.selectedCardList.cliCode, cardListPayload).subscribe({
      next: (updatedCardList: CardList) => {
        const index = this.cardListsList.findIndex(l => l.cliCode === updatedCardList.cliCode);
        if (index !== -1) {
          this.cardListsList[index] = updatedCardList;
          this.cardListsList = [...this.cardListsList];
        }
        this.newCardList = new CardList({ wallet: new Wallet(), cards: [] });
        this.selectedCardList = null;
        this.isCardListEditMode = false;
        this.isCardListVisible = false;
        this.showSuccessMessage('Card list updated successfully');
        this.searchCardLists(); // Reapply search to update filteredCardListsList
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.error?.message || `Failed to update card list: ${error.status} ${error.statusText}`;
        this.showErrorMessage(message);
        console.error('Error updating card list:', error);
      }
    });
  } else {
    this.cardListService.create(cardListPayload).subscribe({
      next: (createdCardList: CardList) => {
        this.cardListsList.push(createdCardList);
        this.newCardList = new CardList({ wallet: new Wallet(), cards: [] });
        this.isCardListVisible = false;
        this.showSuccessMessage('Card list added successfully');
        this.searchCardLists(); // Reapply search to update filteredCardListsList
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.error?.message || `Failed to create card list: ${error.status} ${error.statusText}`;
        this.showErrorMessage(message);
        console.error('Error creating card list:', error);
      }
    });
  }
}

  // Edit card list
  editCardList(cardList: CardList): void {
    this.errorMessage = null;
    // console.log('editCardList: Editing card list:', cardList);
    this.selectedCardList = cardList;
    this.newCardList = { ...cardList, wallet: cardList.wallet ? { ...cardList.wallet } : new Wallet() };
    this.isCardListEditMode = true;
    this.isCardListVisible = true;
    this.cdr.detectChanges();
  }

  // Delete card list
  deleteCardList(cliCode: number | undefined): void {
  this.errorMessage = null;
  if (cliCode && confirm('Are you sure you want to delete this card list?')) {
    this.cardListService.delete(cliCode).subscribe({
      next: () => {
        this.cardListsList = this.cardListsList.filter(l => l.cliCode !== cliCode);
        this.searchCardLists(); // Reapply search to update filteredCardListsList
        this.showSuccessMessage('Card list deleted successfully');
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.status ? `Failed to delete card list: ${error.status} ${error.statusText}` : 'Failed to delete card list: Server error';
        this.showErrorMessage(message);
        console.error('Error deleting card list:', error);
      }
    });
  }
}

  // Save wallet status
  saveStatus(): void {
    this.errorMessage = null;
    // console.log('saveStatus: Saving wallet status:', this.selectedStatus);
    if (/* !this.selectedStatus.wstIden ||  */!this.selectedStatus!.wstLabe) {
      this.showErrorMessage('Please fill in all required fields: Status Label.');
      return;
    }
    if (this.isStatusEditMode) {
      this.walletStatusService.update(this.selectedStatus!.wstCode!, this.selectedStatus!, this.getHttpOptions()).subscribe({
        next: () => {
          // console.log('saveStatus: Wallet status updated');
          this.loadWalletStatuses();
          this.closeForm('wallet-status');
          this.showSuccessMessage('Wallet status updated successfully');
        },
        error: (error: HttpErrorResponse) => {
          const message = error.status ? `Failed to update wallet status: ${error.status} ${error.statusText}` : 'Failed to update wallet status: Server error';
          this.showErrorMessage(message);
          console.error('Error updating wallet status:', error);
        }
      });
    } else {
      this.walletStatusService.create(this.selectedStatus!, this.getHttpOptions()).subscribe({
        next: () => {
          // console.log('saveStatus: Wallet status created');
          this.loadWalletStatuses();
          this.closeForm('wallet-status');
          this.showSuccessMessage('Wallet status added successfully');
        },
        error: (error: HttpErrorResponse) => {
          const message = error.status ? `Failed to create wallet status: ${error.status} ${error.statusText}` : 'Failed to create wallet status: Server error';
          this.showErrorMessage(message);
          console.error('Error creating wallet status:', error);
        }
      });
    }
  }

  // Save wallet category
  saveCategory(): void {
    this.errorMessage = null;
    // console.log('saveCategory: Saving wallet category:', this.selectedCategory!);
    if (/* !this.selectedCategory!.wcaIden ||  */!this.selectedCategory!.wcaLabe || !this.selectedCategory!.wcaFinId) {
      this.showErrorMessage('Please fill in all required fields: Label, and Financial Institution ID.');
      return;
    }
    if (this.isCategoryEditMode) {
      this.walletCategoryService.update(this.selectedCategory!.wcaCode!, this.selectedCategory!, this.getHttpOptions()).subscribe({
        next: () => {
          // console.log('saveCategory: Wallet category updated');
          this.loadWalletCategories();
          this.closeForm('wallet-category');
          this.showSuccessMessage('Wallet category updated successfully');
        },
        error: (error: HttpErrorResponse) => {
          const message = error.status ? `Failed to update wallet category: ${error.status} ${error.statusText}` : 'Failed to update wallet category: Server error';
          this.showErrorMessage(message);
          console.error('Error updating wallet category:', error);
        }
      });
    } else {
      this.walletCategoryService.create(this.selectedCategory!, this.getHttpOptions()).subscribe({
        next: () => {
          // console.log('saveCategory: Wallet category created');
          this.loadWalletCategories();
          this.closeForm('wallet-category');
          this.showSuccessMessage('Wallet category added successfully');
        },
        error: (error: HttpErrorResponse) => {
          const message = error.status ? `Failed to create wallet category: ${error.status} ${error.statusText}` : 'Failed to create wallet category: Server error';
          this.showErrorMessage(message);
          console.error('Error creating wallet category:', error);
        }
      });
    }
  }

  // Add wallet type
  addWalletType(): void {
    // console.log('addWalletType: Adding wallet type:', this.newWalletType);
    if (/* !this.newWalletType.wtyIden ||  */!this.newWalletType!.wtyLabe) {
      this.showErrorMessage('Please fill in all required fields: Type Label.');
      return;
    }
    this.walletTypeService.create(this.newWalletType!, this.getHttpOptions()).subscribe({
      next: (createdWalletType: WalletType) => {
        // console.log('addWalletType: Wallet type added:', createdWalletType);
        this.walletTypesList.push(createdWalletType);
        this.newWalletType = new WalletType();
        this.isWalletTypeVisible = false;
        this.showSuccessMessage('Wallet type added successfully');
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.status ? `Failed to add wallet type: ${error.status} ${error.statusText}` : 'Failed to add wallet type: Server error';
        this.showErrorMessage(message);
        console.error('addWalletType: Error:', error);
      }
    });
  }

  // Edit wallet type
  editWalletType(type: WalletType): void {
    // console.log('editWalletType: Wallet type object:', type);
    this.selectedWalletType = type;
    this.newWalletType = { ...type };
    this.isWalletTypeEditMode = true;
    this.isWalletTypeVisible = true;
    this.cdr.detectChanges();
  }

  // Update wallet type
  updateWalletType(): void {
    // console.log('updateWalletType: Updating wallet type:', this.newWalletType);
    if (/* !this.newWalletType.wtyIden ||  */!this.newWalletType!.wtyLabe) {
      this.showErrorMessage('Please fill in all required fields: Type Label.');
      return;
    }
    if (this.selectedWalletType?.wtyCode) {
      this.walletTypeService.update(this.selectedWalletType.wtyCode, this.newWalletType!, this.getHttpOptions()).subscribe({
        next: (updatedWalletType: WalletType) => {
          // console.log('updateWalletType: Wallet type updated:', updatedWalletType);
          const index = this.walletTypesList.findIndex(t => t.wtyCode === updatedWalletType.wtyCode);
          if (index !== -1) {
            this.walletTypesList[index] = updatedWalletType;
            this.walletTypesList = [...this.walletTypesList];
          }
          this.newWalletType = new WalletType();
          this.selectedWalletType = undefined;
          this.isWalletTypeEditMode = false;
          this.isWalletTypeVisible = false;
          this.showSuccessMessage('Wallet type updated successfully');
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          const message = error.status ? `Failed to update wallet type: ${error.status} ${error.statusText}` : 'Failed to update wallet type: Server error';
          this.showErrorMessage(message);
          console.error('updateWalletType: Error:', error);
        }
      });
    } else {
      this.showErrorMessage('No wallet type selected for update.');
    }
  }

  // Save wallet type (handles both add and update)
  saveWalletType(): void {
    this.errorMessage = null;
    if (this.isWalletTypeEditMode) {
      this.updateWalletType();
    } else {
      this.addWalletType();
    }
  }

  // Delete wallet type
  deleteWalletType(wtyCode: number | undefined): void {
    // console.log('deleteWalletType: wtyCode:', wtyCode);
    if (wtyCode && confirm('Are you sure you want to delete this wallet type?')) {
      this.walletTypeService.delete(wtyCode, this.getHttpOptions()).subscribe({
        next: () => {
          // console.log('deleteWalletType: Success, wtyCode:', wtyCode);
          this.walletTypesList = this.walletTypesList.filter(t => t.wtyCode !== wtyCode);
          this.filteredWalletTypes = this.filteredWalletTypes.filter(t => t.wtyCode !== wtyCode);
          this.showSuccessMessage('Wallet type deleted successfully');
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          const message = error.status ? `Failed to delete wallet type: ${error.status} ${error.statusText}` : 'Failed to delete wallet type: Server error';
          this.showErrorMessage(message);
          console.error('deleteWalletType: Error:', error);
        }
      });
    }
  }

  // Edit wallet status
  editStatus(status: WalletStatus): void {
    this.errorMessage = null;
    // console.log('editStatus: Editing wallet status:', status);
    this.selectedStatus = { ...status };
    this.isStatusEditMode = true;
    this.isWalletStatusVisible = true;
    this.cdr.detectChanges();
  }

  // Edit wallet category
  editCategory(category: WalletCategory): void {
    this.errorMessage = null;
    // console.log('editCategory: Editing wallet category:', category);
    this.selectedCategory! = { ...category };
    this.isCategoryEditMode = true;
    this.isWalletCategoryVisible = true;
    this.cdr.detectChanges();
  }

  // Delete wallet status
  deleteStatus(wstCode: number | undefined): void {
    this.errorMessage = null;
    // console.log('deleteStatus: wstCode:', wstCode);
    if (wstCode && confirm('Are you sure you want to delete this status?')) {
      this.walletStatusService.delete(wstCode, this.getHttpOptions()).subscribe({
        next: () => {
          // console.log('deleteStatus: Success, wstCode:', wstCode);
          this.walletStatuses = this.walletStatuses.filter(s => s.wstCode !== wstCode);
          this.filteredStatuses = this.filteredStatuses.filter(s => s.wstCode !== wstCode);
          this.showSuccessMessage('Wallet status deleted successfully');
        },
        error: (error: HttpErrorResponse) => {
          const message = error.status ? `Failed to delete wallet status: ${error.status} ${error.statusText}` : 'Failed to delete wallet status: Server error';
          this.showErrorMessage(message);
          console.error('Error deleting wallet status:', error);
        }
      });
    }
  }

  // Delete wallet category
  deleteCategory(wcaCode: number | undefined): void {
    this.errorMessage = null;
    // console.log('deleteCategory: wcaCode:', wcaCode);
    if (wcaCode && confirm('Are you sure you want to delete this category?')) {
      this.walletCategoryService.delete(wcaCode, this.getHttpOptions()).subscribe({
        next: () => {
          // console.log('deleteCategory: Success, wcaCode:', wcaCode);
          this.walletCategories = this.walletCategories.filter(c => c.wcaCode !== wcaCode);
          this.filteredWalletCategories = this.filteredWalletCategories.filter(c => c.wcaCode !== wcaCode);
          this.showSuccessMessage('Wallet category deleted successfully');
        },
        error: (error: HttpErrorResponse) => {
          const message = error.status ? `Failed to delete wallet category: ${error.status} ${error.statusText}` : 'Failed to delete wallet category: Server error';
          this.showErrorMessage(message);
          console.error('Error deleting wallet category:', error);
        }
      });
    }
  }

  // Show success message
  showSuccessMessage(message: string): void {
    // console.log('showSuccessMessage:', message);
      (new Audio('assets/notification.mp3')).play()
    this.successMessage = message;
    this.errorMessage = null;
    setTimeout(() => {
      this.successMessage = null;
      this.cdr.detectChanges();
    }, 3000);
  }

  // Show error message
  showErrorMessage(message: string): void {
    // console.log('showErrorMessage:', message);
      (new Audio('assets/notification.mp3')).play()
    this.errorMessage = message;
    this.successMessage = null;
    setTimeout(() => {
      this.errorMessage = null;
      this.cdr.detectChanges();
    }, 3000);
  }

  // Toggle form visibility
  toggleForm(modal: string): void {
    this.errorMessage = null;
    // console.log('toggleForm: Opening modal:', modal);
    switch (modal) {
      case 'create-wallet':
        this.isWalletFormVisible = true;
        break;
      case 'wallet-details':
        this.isWalletDetailsVisible = true;
        break;
      case 'wallet-status':
        this.isWalletStatusVisible = true;
        this.isStatusEditMode = false;
        this.selectedStatus = new WalletStatus();
        break;
      case 'wallet-type':
        this.isWalletTypeVisible = true;
        this.isWalletTypeEditMode = false;
        this.newWalletType = new WalletType();
        this.selectedWalletType = undefined;
        break;
      case 'wallet-category':
        this.isWalletCategoryVisible = true;
        this.isCategoryEditMode = false;
        this.selectedCategory! = new WalletCategory();
        break;
      case 'create-card':
        this.isCardFormVisible = true;
        this.isCardEditMode = false;
        this.newCard = new Card({ cardList: new CardList({ wallet: new Wallet() }), cardType: new CardType() });
        this.selectedCard = null;
        break;
      case 'card-type':
        this.isCardTypeVisible = true;
        this.isCardTypeEditMode = false;
        this.newCardType = new CardType();
        this.selectedCardType = null;
        break;
      case 'card-list':
        this.isCardListVisible = true;
        this.isCardListEditMode = false;
        this.newCardList = new CardList({ wallet: new Wallet() });
        this.selectedCardList = null;
        break;
      case 'create-account':
        this.isAccountFormVisible = true;
        break;
      case 'account-type':
        this.isAccountTypeVisible = true;
        this.isAccountTypeEditMode = false;
        this.newAccountType = new AccountType();
        this.selectedAccountType = null;
        break;
      case 'account-list':
        this.isAccountListVisible = true;
        break;
    }
    this.cdr.detectChanges();
  }

  // Close form
  closeForm(modal: string): void {
    this.errorMessage = null;
    // console.log('closeForm: Closing modal:', modal);
    switch (modal) {
      case 'create-wallet':
        this.isWalletFormVisible = false;
        break;
      case 'wallet-details':
        this.isWalletDetailsVisible = false;
        break;
      case 'wallet-status':
        this.isWalletStatusVisible = false;
        this.selectedStatus = new WalletStatus();
        this.isStatusEditMode = false;
        break;
      case 'wallet-type':
        this.isWalletTypeVisible = false;
        this.newWalletType = new WalletType();
        this.selectedWalletType = undefined;
        this.isWalletTypeEditMode = false;
        break;
      case 'wallet-category':
        this.isWalletCategoryVisible = false;
        this.selectedCategory! = new WalletCategory();
        this.isCategoryEditMode = false;
        break;
      case 'create-card':
        this.isCardFormVisible = false;
        this.newCard = new Card({ cardList: new CardList({ wallet: new Wallet() }), cardType: new CardType() });
        this.selectedCard = null;
        this.isCardEditMode = false;
        break;
      case 'card-type':
        this.isCardTypeVisible = false;
        this.newCardType = new CardType();
        this.selectedCardType = null;
        this.isCardTypeEditMode = false;
        break;
      case 'card-list':
        this.isCardListVisible = false;
        this.newCardList = new CardList({ wallet: new Wallet() });
        this.selectedCardList = null;
        this.isCardListEditMode = false;
        break;
      case 'create-account':
        this.isAccountFormVisible = false;
        break;
      case 'account-type':
        this.isAccountTypeVisible = false;
        this.newAccountType = new AccountType();
        this.selectedAccountType = null;
        this.isAccountTypeEditMode = false;
        break;
      case 'account-list':
        this.isAccountListVisible = false;
        break;
    }
    this.cdr.detectChanges();
  }

  // Check if any modal is visible
  get isAnyModalVisible(): boolean {
    return (
      this.isWalletDetailsVisible ||
      this.isWalletFormVisible ||
      this.isWalletStatusVisible ||
      this.isWalletTypeVisible ||
      this.isWalletCategoryVisible ||
      this.isCardFormVisible ||
      this.isCardTypeVisible ||
      this.isCardListVisible ||
      this.isAccountFormVisible ||
      this.isAccountTypeVisible ||
      this.isAccountListVisible
    );
  }

  // Show specific tab
  showTab(tabId: string, tabType?: string): void {

    const buttonClass = tabType ? `${tabType}-tab-button` : 'tab-button';
    const contentClass = tabType ? `${tabType}-tab-content` : 'tab-content';
    const tabButtons = document.querySelectorAll(`.${buttonClass}`);
    const tabContents = document.querySelectorAll(`.${contentClass}`);

    // Reset all buttons and contents
    tabButtons.forEach(btn => {
      btn.classList.remove('active', 'text-primary', 'font-medium', 'border-b-2', 'border-primary', 'transition-colors');
      btn.classList.add('text-gray-500');
    });

    tabContents.forEach(content => content.classList.add('hidden'));

    // Activate the clicked button and show its tab content
    const activeButton = tabType ? document.getElementById(tabType + '-' + tabId) : document.getElementById(tabId);
    activeButton?.classList.add('active', 'text-primary', 'font-medium', 'border-b-2', 'border-primary', 'transition-colors');
    activeButton?.classList.remove('text-gray-500');

    const activeId = tabType ? `${tabType}-tab-${tabId}` : `tab-${tabId}`;
    const activeContent = document.getElementById(activeId);
    activeContent?.classList.remove('hidden');
  }

  // Format date for display (e.g., DD-MM-YYYY)
  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
  }

  // Parse date from input (e.g., DD-MM-YYYY to Date)
  parseDate(dateStr: string): Date | undefined {
    if (!dateStr) return undefined;
    const [day, month, year] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? undefined : date;
  }

  // Handle expiry date input change
  onExpiryDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.newCard.carExpiryDate = this.parseDate(input.value);
  }
  compareBy(property: string): (a: any, b: any) => boolean {
    return (a: any, b: any) => a && b && a[property] === b[property];
  }
}