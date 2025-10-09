import { Component, OnInit } from '@angular/core';
import { Customer } from '../../../entities/customer';
import { CustomerService } from '../../../services/customer.service';
import { NotificationService } from '../../../services/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CustomerIdentity } from '../../../entities/customer-identity';
import { CustomerDoc } from '../../../entities/customer-doc';
import { CustomerDocService } from '../../../services/customer-doc.service';
import { WalletService } from '../../../services/wallet.service'; // Add this import
import { Wallet } from '../../../entities/wallet'; // Add this import
import { Account } from '../../../entities/account'; // Add this import
import { Card } from '../../../entities/card'; // Add this import
import { AccountService } from '../../../services/account.service'; // Add this import
import { CardService } from '../../../services/card.service'; // Add this import

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  customer: Customer = new Customer();
  loading: boolean = true;
  error: string | null = null;
  activeSection: string = 'account';
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;

  customerDocs: CustomerDoc[] = []; // List of customer documents
  selectedDoc?: CustomerDoc;

  // Add wallet-related properties
  wallet?: Wallet;
  accounts: Account[] = [];
  cards: Card[] = [];
  
  // Add editing states
  editingAccount: Account | null = null;
  editingCard: Card | null = null;
  isAddingAccount: boolean = false;
  isAddingCard: boolean = false;
  
  // Add form models for new items
  newAccount: Partial<Account> = {};
  newCard: Partial<Card> = {};

  notificationPreferences = {
    email: true,
    push: true,
    sms: false,
    allTransactions: false,
    largeTransactions: true,
    deposits: true,
    withdrawals: true,
    securityAlerts: true,
    accountUpdates: true,
    marketing: false,
  };

  privacySettings = {
    activityTracking: true,
    locationServices: false,
    dataSharing: false,
    personalizedAds: true,
    twoFactorAuth: true,
  };

  displaySettings = {
    theme: 'light',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12-hour',
    largerText: false,
    highContrast: false,
    reduceMotion: false,
  };

  paymentSettings = {
    defaultPaymentMethod: 'visa',
    autoPayBills: true,
    saveNewMethods: true,
    paymentConfirmation: true,
  };

  constructor(
    private customerService: CustomerService,
    private customerDocService: CustomerDocService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private walletService: WalletService, // Add this
    private accountService: AccountService, // Add this
    private cardService: CardService // Add this
  ) {
    this.customer.city = { ctyLabe: '' };
    this.customer.country = { ctrLabe: '' };
  }

  ngOnInit(): void {
    this.fetchCustomerData();
    this.loadNotificationPreferences();
  }

  loadNotificationPreferences(): void {
    this.notificationService.getNotificationPreferences().subscribe({
      next: (preferences) => {
        this.notificationPreferences = preferences;
      },
      error: (err) => {
        console.error('Failed to load notification preferences:', err);
      },
    });
  }

  fetchCustomerData(): void {
    const cusCode = localStorage.getItem('cusCode');
    if (!cusCode) {
      this.error = 'No logged in user';
      this.loading = false;
      return;
    }

    this.customerService.getCustomerById(+cusCode).subscribe({
      next: (data: Customer) => {
        this.customer = Object.assign(new Customer(), data);
        this.customer.city = data.city || { ctyLabe: '' };
        this.customer.country = data.country || { ctrLabe: '' };
        this.loading = false;
        
        // Load customer documents
        this.customerDocService.getByCustomerDocListe(this.customer?.identity?.customerDocListe?.cdlCode!).subscribe({
          next: (docs: CustomerDoc[]) => {
            this.customerDocs = docs;
            console.log(this.customerDocs);
          },
          error: (err) => { console.log(err); }
        });

        // Load wallet data for connected accounts
        this.loadWalletData();
      },
      error: (err) => {
        this.error = 'Failed to fetch customer data';
        this.loading = false;
        console.error('Error fetching customer:', err);
      },
    });
  }

  // Add method to load wallet data
  loadWalletData(): void {
    const cusCode = localStorage.getItem('cusCode');
    if (!cusCode) return;

    this.walletService.getWalletByCustomerCode(+cusCode).subscribe({
      next: (wallet: Wallet) => {
        this.wallet = wallet;
        this.loadAccounts();
        this.loadCards();
      },
      error: (err) => {
        console.error('Error loading wallet:', err);
      }
    });
  }

  // Add method to load accounts
  loadAccounts(): void {
    if (!this.wallet?.accountList?.aliCode) return;

    this.accountService.getAllAccounts().subscribe({
      next: (accounts: Account[]) => {
        // Filter accounts by the wallet's account list
        this.accounts = accounts.filter(account => 
          account.accountList?.aliCode === this.wallet?.accountList?.aliCode
        );
      },
      error: (err) => {
        console.error('Error loading accounts:', err);
      }
    });
  }

  // Add method to load cards
  loadCards(): void {
    if (!this.wallet?.cardList?.cliCode) return;

    this.cardService.getAll().subscribe({
      next: (cards: Card[]) => {
        // Filter cards by the wallet's card list
        this.cards = cards.filter(card => 
          card.cardList?.cliCode === this.wallet?.cardList?.cliCode
        );
      },
      error: (err) => {
        console.error('Error loading cards:', err);
      }
    });
  }

  // Add account management methods
  editAccount(account: Account): void {
    this.editingAccount = { ...account };
    this.isAddingAccount = false;
  }

  cancelEditAccount(): void {
    this.editingAccount = null;
    this.isAddingAccount = false;
    this.newAccount = {};
  }

  saveAccount(): void {
    if (this.editingAccount) {
      // Update existing account
      this.accountService.updateAccount(this.editingAccount.accCode!, this.editingAccount).subscribe({
        next: (updatedAccount) => {
          const index = this.accounts.findIndex(a => a.accCode === updatedAccount.accCode);
          if (index !== -1) {
            this.accounts[index] = updatedAccount;
          }
          this.editingAccount = null;
          alert('Account updated successfully!');
        },
        error: (err) => {
          console.error('Error updating account:', err);
          alert('Failed to update account');
        }
      });
    } else if (this.isAddingAccount) {
      // Add new account
      this.accountService.createAccount(this.newAccount as Account).subscribe({
        next: (newAccount) => {
          this.accounts.push(newAccount);
          this.isAddingAccount = false;
          this.newAccount = {};
          alert('Account added successfully!');
        },
        error: (err) => {
          console.error('Error adding account:', err);
          alert('Failed to add account');
        }
      });
    }
  }

  deleteAccount(account: Account): void {
    if (confirm('Are you sure you want to delete this account?')) {
      this.accountService.deleteAccount(account.accCode!).subscribe({
        next: () => {
          this.accounts = this.accounts.filter(a => a.accCode !== account.accCode);
          alert('Account deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting account:', err);
          alert('Failed to delete account');
        }
      });
    }
  }

  // Add card management methods
  editCard(card: Card): void {
    this.editingCard = { ...card };
    this.isAddingCard = false;
  }

  cancelEditCard(): void {
    this.editingCard = null;
    this.isAddingCard = false;
    this.newCard = {};
  }

  saveCard(): void {
    if (this.editingCard) {
      // Update existing card
      this.cardService.update(this.editingCard.carCode!, this.editingCard).subscribe({
        next: (updatedCard) => {
          const index = this.cards.findIndex(c => c.carCode === updatedCard.carCode);
          if (index !== -1) {
            this.cards[index] = updatedCard;
          }
          this.editingCard = null;
          alert('Card updated successfully!');
        },
        error: (err) => {
          console.error('Error updating card:', err);
          alert('Failed to update card');
        }
      });
    } else if (this.isAddingCard) {
      // Add new card
      this.cardService.create(this.newCard as Card).subscribe({
        next: (newCard) => {
          this.cards.push(newCard);
          this.isAddingCard = false;
          this.newCard = {};
          alert('Card added successfully!');
        },
        error: (err) => {
          console.error('Error adding card:', err);
          alert('Failed to add card');
        }
      });
    }
  }

  deleteCard(card: Card): void {
    if (confirm('Are you sure you want to delete this card?')) {
      this.cardService.delete(card.carCode!).subscribe({
        next: () => {
          this.cards = this.cards.filter(c => c.carCode !== card.carCode);
          alert('Card deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting card:', err);
          alert('Failed to delete card');
        }
      });
    }
  }

  // Existing methods remain the same...
  updateCustomer(): void {
    if (!this.customer || typeof this.customer.cusCode === 'undefined') {
      alert('Customer code is missing.');
      return;
    }
    this.customerService.updateCustomer(this.customer.cusCode, this.customer).subscribe({
      next: (updatedCustomer) => {
        this.customer = updatedCustomer;
        alert('Profile updated successfully!');
      },
      error: (err) => {
        console.error('Error updating customer:', err);
        alert('Failed to update profile');
      },
    });
  }

  switchSection(section: string): void {
    this.activeSection = section;
    // Reset editing states when switching sections
    if (section !== 'connected') {
      this.editingAccount = null;
      this.editingCard = null;
      this.isAddingAccount = false;
      this.isAddingCard = false;
    }
  }

  updateNotificationPreference(key: keyof typeof this.notificationPreferences): void {
    this.notificationPreferences[key] = !this.notificationPreferences[key];
    this.notificationService.saveNotificationPreferences(this.notificationPreferences).subscribe({
      next: () => {
        console.log(`Notification preference ${key} toggled:`, this.notificationPreferences[key]);
      },
      error: (err) => {
        console.error('Failed to save notification preferences:', err);
      },
    });
  }

  saveSettings(): void {
    const settings = {
      notificationPreferences: this.notificationPreferences,
      privacySettings: this.privacySettings,
      displaySettings: this.displaySettings,
      paymentSettings: this.paymentSettings,
    };
    this.notificationService.saveNotificationPreferences(this.notificationPreferences).subscribe({
      next: () => {
        alert('Settings saved successfully!');
      },
      error: (err) => {
        console.error('Failed to save settings:', err);
        alert('Failed to save settings');
      },
    });
  }

  resetPassword() {
    if (!this.currentPassword || !this.newPassword || !this.confirmNewPassword) {
      alert('Please fill all required fields!');
      return;
    }
    if (this.newPassword !== this.confirmNewPassword) {
      alert('New password mismatch');
      return;
    }
    this.customerService.checkPassword(this.customer.cusCode!, this.currentPassword).subscribe({
      next: (result: boolean) => {
        if (!result) {
          alert('Incorrect password!');
          return;
        }
        this.authService.resetPassword(this.customer.cusMailAddress!, this.newPassword!).subscribe({
          next: (result: any) => {
            if (result.message === 'success') {
              alert('Password updated successfully!');
            }
          },
          error: (err) => {
            console.error(err);
            alert('Failed to update password!');
          },
        });
      },
      error: (err) => {
        console.error(err);
        alert('Failed to check password!');
      },
    });
  }

  previewDocument(customerDoc: CustomerDoc) {
    this.customerDocService.getFileById(customerDoc.cdoCode!);
  }

  closePreview() {
    this.selectedDoc = undefined;
  }
}