import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/customer.service'; // Adjust the path as needed

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
  growthRatePercentage: string = '0%';

  constructor(private customerService: CustomerService) {
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

    // Fetch growth rate
    this.customerService.getGrowthRate().subscribe({
      next: (rate: number) => {
        this.growthRate = rate;
        // Placeholder for percentage change logic
        this.growthRatePercentage = '1.2%'; // Replace with actual logic if available
      },
      error: (err: any) => console.error('Error fetching growth rate:', err),
    });
  }
}