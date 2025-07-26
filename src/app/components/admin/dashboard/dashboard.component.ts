import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/customer.service'; // Adjust the path as needed
import { WalletService } from '../../../services/wallet.service';
import { Wallet } from '../../../entities/wallet';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  currentDate: string;
  totalCustomers: number = 0;
  activeCustomers: number = 0;
  newCustomersToday: number = 0;
  growthRate: number = 0;
  totalCustomersPercentage: string = '0%';
  activeCustomersPercentage: string = '0%';
  newCustomersPercentage: string = '0%';
  activeWalletCount: number = 0;
  pendingWalletCount: number = 0;

    errorMessage: string | null = null;
  successMessage: string | null = null;


  constructor(private customerService: CustomerService, private cdr: ChangeDetectorRef, private walletService: WalletService) {
    const today = new Date();
    
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };
    this.currentDate = today.toLocaleDateString('en-US', options);

    
  }

  ngOnInit(): void {
    this.loadCustomerCounts();
    
    this.loadActiveWalletCount();
    this.loadPendingWalletCount();
  }

  loadCustomerCounts(): void {
    // Fetch total customers
    this.customerService.getTotalCustomerCount().subscribe({
      next: (count: number) => {
        this.totalCustomers = count;
        // Placeholder for percentage change logic
        this.totalCustomersPercentage = '12.5%'; // Replace with actual logic if available
      },
      error: (err: any) => console.error('Error fetching total customers:', err),
    });

    // Fetch active customers (assuming statusCode 1 is "ACTIVE")
    this.customerService.getActiveCustomerCount(1).subscribe({
      next: (count: number) => {
        this.activeCustomers = count;
        // Placeholder for percentage change logic
        this.activeCustomersPercentage = '8.2%'; // Replace with actual logic if available
      },
      error: (err: any) => console.error('Error fetching active customers:', err),
    });

    // Fetch new customers today
    this.customerService.getNewCustomersToday().subscribe({
      next: (count: number) => {
        this.newCustomersToday = count;
        // Placeholder for percentage change from yesterday
        this.newCustomersPercentage = '-3.8%'; // Assuming a decrease as per your HTML
      },
      error: (err: any) => console.error('Error fetching new customers today:', err),
    });

    
  }

  loadActiveWalletCount(): void {
    this.errorMessage = null;
    // console.log('loadActiveWalletCount: Fetching active wallet count...');
    this.walletService.getActiveWalletCount().subscribe({
      next: (count: number) => {
        // console.log('loadActiveWalletCount: Active wallet count received:', count);
        this.activeWalletCount = count;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.status ? `Failed to load active wallet count: ${error.status} ${error.statusText}` : 'Failed to load active wallet count: Server error';
        this.showErrorMessage(message);
        console.error('Error loading active wallet count:', error);
      }
    });
  }
    loadPendingWalletCount(): void {
    this.errorMessage = null;
    // console.log('loadPendingWalletCount: Fetching pending wallet count...');
    this.walletService.getPendingWalletCount().subscribe({
      next: (count: number) => {
        // console.log('loadPendingWalletCount: Pending wallet count received:', count);
        this.pendingWalletCount = count;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.status ? `Failed to load pending wallet count: ${error.status} ${error.statusText}` : 'Failed to load pending wallet count: Server error';
        this.showErrorMessage(message);
        console.error('Error loading pending wallet count:', error);
      }
    });
  }

  // Show error message
  showErrorMessage(message: string): void {
    // console.log('showErrorMessage:', message);
    this.errorMessage = message;
    this.successMessage = null;
    setTimeout(() => {
      this.errorMessage = null;
      this.cdr.detectChanges();
    }, 3000);
  }

  // Show success message
  showSuccessMessage(message: string): void {
    // console.log('showSuccessMessage:', message);
    this.successMessage = message;
    this.errorMessage = null;
    setTimeout(() => {
      this.successMessage = null;
      this.cdr.detectChanges();
    }, 3000);
  }
}