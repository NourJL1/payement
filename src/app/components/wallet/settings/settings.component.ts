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

  customerDocs: CustomerDoc[] = [] // List of customer documents
  selectedDoc?: CustomerDoc

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
    private notificationService: NotificationService
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
        this.customerDocService.getByCustomerDocListe(this.customer?.identity?.customerDocListe?.cdlCode!).subscribe({
      next: (docs: CustomerDoc[]) => {
        this.customerDocs = docs
        console.log(this.customerDocs)
      },
      error: (err) => { console.log(err) }
    })
      },
      error: (err) => {
        this.error = 'Failed to fetch customer data';
        this.loading = false;
        console.error('Error fetching customer:', err);
      },
    });
  }

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
    this.customerDocService.getFileById(customerDoc.cdoCode!)
  }

  closePreview() {
    this.selectedDoc = undefined
  }

}