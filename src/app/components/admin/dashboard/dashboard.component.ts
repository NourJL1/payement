import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/customer.service'; // Adjust the path as needed
import { WalletService } from '../../../services/wallet.service';
import { Wallet } from '../../../entities/wallet';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  currentDate: string;
  totalCustomers: number = 0;
  totalUsers: number = 0; // Assuming you want to track total users as well
  activeCustomers: number = 0;
  newCustomersToday: number = 0;
  growthRate: number = 0;
  totalCustomersPercentage: string = '0%';
  activeCustomersPercentage: string = '0%';
  newCustomersPercentage: string = '0%';
  activeWalletCount: number = 0;
  pendingWalletCount: number = 0;
  customerChart: Chart | undefined;

    errorMessage: string | null = null;
  successMessage: string | null = null;


  constructor(private customerService: CustomerService, private cdr: ChangeDetectorRef, private walletService: WalletService, private userService: UserService) {
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
    console.log('ngOnInit triggered');
    this.loadCustomerCounts();
    this.loadUserCounts();
    this.loadActiveWalletCount();
    this.loadPendingWalletCount();
    // Do not initialize chart here; wait for ngAfterViewInit
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit triggered');
    this.loadCustomerDistributionByCity();
  }

  loadUserCounts(): void {
    this.userService.getTotalUserCount().subscribe({
      next: (count: number) => {
        this.totalUsers = count;
        // Placeholder for percentage change logic
        this.totalCustomersPercentage = '12.5%'; // Replace with actual logic if available
      },
      error: (err: any) => console.error('Error fetching total users:', err),
    });
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

   loadCustomerDistributionByCity(): void {
    this.customerService.getCustomerCountByCity().subscribe({
      next: (cityCounts) => {
        this.createCustomerChart(cityCounts);
      },
      error: (err) => console.error('Error fetching customer distribution:', err),
    });
  }

  createCustomerChart(cityCounts: { [key: string]: number }): void {
    console.log('Creating chart with data:', cityCounts);
    const ctx = document.getElementById('customerChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Canvas element #customerChart not found');
      return;
    }
    if (this.customerChart) {
      this.customerChart.destroy();
    }
    this.customerChart = new Chart(ctx, {
      type: 'doughnut', // Ensure this type is registered
      data: {
        labels: Object.keys(cityCounts),
        datasets: [
          {
            data: Object.values(cityCounts),
            backgroundColor: ['#FFF9B0', '#F4B6C2', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: '',
          },
        },
      },
    });
    console.log('Chart created successfully');
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