import { Component } from '@angular/core';
import { WalletService } from '../../services/wallet.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { Wallet } from '../../entities/wallet';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  cusMotDePasse: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private customerService: CustomerService,
    private walletService: WalletService,
    private router: Router
  ) { }

  ngOnInit(): void {
    localStorage.clear()
  }

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    this.customerService.login(this.username, this.cusMotDePasse).subscribe({
      next: (response) => {

        // Store user data in localStorage
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('cusCode', response.cusCode);
        localStorage.setItem('role', response.role?.name || 'CUSTOMER');
        localStorage.setItem('roles', response.roles || ['ROLE_CUSTOMER']); // Fallback to ROLE_CUSTOMER
        localStorage.setItem('username', response.username);
        localStorage.setItem('fullname', response.fullname || '');
        localStorage.setItem('status', response.status || 'PENDING');

        const role = (response.role?.name || 'CUSTOMER');

        if (role === 'ADMIN')
          this.router.navigate(['/admin/dashboard']);
        else {

          switch(response.status)
          {
            case 'ACTIVE':
              this.walletService.getWalletByCustomerCode(response.cusCode).subscribe({
              next: (walletData: Wallet) => {
                const statusLabel = walletData.walletStatus?.wstLabe?.trim().toUpperCase();

                if (statusLabel === 'ACTIVE') {
                  this.router.navigate(['/wallet/overview']);
                } else {
                  this.errorMessage = 'Unknown wallet status: ' + statusLabel;
                }
              },
              error: (err) => {
                console.error('Error fetching wallet data:', err);
                this.errorMessage = 'Failed to fetch wallet data.';
              }
            });
              break;
            case 'SUSPENDED':
              this.router.navigate(['/suspended']);
              break;
            case 'PENDING':
              this.router.navigate(['/pending']);
              break;
            default:
              this.errorMessage = 'Unknown status: ' + response.status;
              console.warn('Unexpected status:', response.status);
          }
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMessage = 'Login failed. Please check your credentials.';
      },
      complete: () => {
        this.isLoading = false; // Hide loading indicator after completion
      }
    })
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
