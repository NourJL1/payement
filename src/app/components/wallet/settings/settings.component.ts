import { Component, OnInit } from '@angular/core';
import { Customer } from '../../../entities/customer';
import { CustomerService } from '../../../services/customer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  customer: Customer = new Customer(); // Ensure city and country are initialized
  loading: boolean = true;
  error: string | null = null;
  activeSection: string = 'account'; // Default active section

  currentPassword?: string
  newPassword?: string
  confirmNewPassword?: string

  // Define notification settings
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
    marketing: false
  };

  // Define privacy settings with twoFactorAuth
  privacySettings = {
    activityTracking: true,
    locationServices: false,
    dataSharing: false,
    personalizedAds: true,
    twoFactorAuth: true // Added for Two-Factor Authentication
  };

  // Define display settings
  displaySettings = {
    theme: 'light', // Options: 'light', 'dark', 'system'
    language: 'en', // Default language
    dateFormat: 'MM/DD/YYYY', // Options: 'MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'
    timeFormat: '12-hour', // Options: '12-hour', '24-hour'
    largerText: false,
    highContrast: false,
    reduceMotion: false
  };

  // Define payment settings
  paymentSettings = {
    defaultPaymentMethod: 'visa', // Options: 'visa', 'mastercard', 'paypal'
    autoPayBills: true,
    saveNewMethods: true,
    paymentConfirmation: true
  };

  constructor(
    private customerService: CustomerService,
    private authService: AuthService) {
    // Initialize city and country to prevent null errors
    this.customer.city = { ctyLabe: '' };
    this.customer.country = { ctrLabe: '' };
  }

  ngOnInit(): void {
    this.fetchCustomerData();
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
        this.customer.city = data.city || { ctyLabe: '' }; // Ensure city is not null
        this.customer.country = data.country || { ctrLabe: '' }; // Ensure country is not null
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to fetch customer data';
        this.loading = false;
        console.error('Error fetching customer:', err);
      }
    });
  }

  updateCustomer(): void {
    if (!this.customer) return;

    if (typeof this.customer.cusCode === 'undefined') {
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
      }
    });
  }

  // Navigation logic to switch between settings sections
  switchSection(section: string): void {
    this.activeSection = section;
  }

  // Handle notification preference changes
  updateNotificationPreference(key: keyof typeof this.notificationPreferences): void {
    this.notificationPreferences[key] = !this.notificationPreferences[key];
    console.log(`Notification preference ${key} toggled:`, this.notificationPreferences[key]);
    // TODO: Add API call to save notification preferences
  }

  // Handle privacy setting changes
  updatePrivacySetting(key: keyof typeof this.privacySettings): void {
    this.privacySettings[key] = !this.privacySettings[key];
    console.log(`Privacy setting ${key} toggled:`, this.privacySettings[key]);
    // TODO: Add API call to save privacy settings
  }

  // Handle display setting changes
  updateDisplaySetting(key: keyof typeof this.displaySettings, value?: string): void {
    if (key === 'theme' || key === 'language' || key === 'dateFormat' || key === 'timeFormat') {
      if (value) {
        this.displaySettings[key] = value;
      }
    } else {
      this.displaySettings[key as 'largerText' | 'highContrast' | 'reduceMotion'] =
        !this.displaySettings[key as 'largerText' | 'highContrast' | 'reduceMotion'];
    }
    console.log(`Display setting ${key} updated:`, this.displaySettings[key]);
    // TODO: Add API call to save display settings
  }

  // Handle payment setting changes
  updatePaymentSetting(key: keyof typeof this.paymentSettings, value?: string): void {
    if (key === 'defaultPaymentMethod' && value) {
      this.paymentSettings[key] = value;
    } else {
      this.paymentSettings[key as 'autoPayBills' | 'saveNewMethods' | 'paymentConfirmation'] =
        !this.paymentSettings[key as 'autoPayBills' | 'saveNewMethods' | 'paymentConfirmation'];
    }
    console.log(`Payment setting ${key} updated:`, this.paymentSettings[key]);
    // TODO: Add API call to save payment settings
  }

  // Save all settings
  saveSettings(): void {
    const settings = {
      notificationPreferences: this.notificationPreferences,
      privacySettings: this.privacySettings,
      displaySettings: this.displaySettings,
      paymentSettings: this.paymentSettings
    };
    console.log('Saving settings:', settings);
    // TODO: Implement API call to save all settings
    alert('Settings saved successfully!');
  }

  onLanguageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.updateDisplaySetting('language', target.value);
    }
  }

  onDefaultPaymentMethodChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.updatePaymentSetting('defaultPaymentMethod', target.value);
    }
  }

  resetPassword() {
    if (!this.currentPassword || !this.newPassword || !this.confirmNewPassword) {
      alert('please fill all required fields!')
      return
    }
    if (this.newPassword != this.confirmNewPassword) {
      alert('new password mismatch')
      return
    }
    this.customerService.checkPassword(this.customer.cusCode!, this.currentPassword).subscribe({
      next: (result: boolean) => {
        if (!result) {
          alert('incorrect password!');
          return
        }

        this.authService.resetPassword(this.customer.cusMailAddress!, this.newPassword!).subscribe(
          {
            next: (result: any) => {
              if (result.message == "success") {
                //this.successMessage = 'Password reset submitted'
                alert('Password updated successfully!');
              }
            },
            error: (err) => {
              console.log(err);
              alert('failed to update password!!');
            }
          }
        );
      },
      error: (err) => {
        console.log(err);
        alert('failed to check password!!');
      },
    })
  }
}