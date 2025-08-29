import { Component } from '@angular/core';
import { Customer } from '../../../entities/customer';
import { CustomerService } from '../../../services/customer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
customer: Customer = new Customer();
  loading: boolean = true;
  error: string | null = null;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.fetchCustomerData();
  }

  fetchCustomerData(): void {
  const cusCode = localStorage.getItem('cusCode'); // 👈 get logged-in customer ID
  if (!cusCode) {
    this.error = 'No logged in user';
    this.loading = false;
    return;
  }

  this.customerService.getCustomerById(+cusCode).subscribe({ // + converts string → number
    next: (data: Customer) => {
      this.customer = data;
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

}
