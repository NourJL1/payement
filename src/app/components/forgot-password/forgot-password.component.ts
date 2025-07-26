import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { CommonModule } from '@angular/common';  // Import CommonModule
import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],  // Add FormsModule and CommonModule
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {

  isLoading: boolean = false;
  email: any;
  errorMessage?: string;
  successMessage?: string;
  code: any;
  isEmailSent?: boolean;
  isVerified: boolean = false;

  password: string = ''
  confirm: string = ''

  constructor(private authService: AuthService, private router: Router) { }

  sendCode() {
    this.errorMessage = '';
    this.successMessage = '';
    this.isEmailSent = false;  // Reset the flag when submitting the form
    this.isLoading = true;  // Show loading indicator

    this.authService.sendEmail(this.email, "Reset Password").subscribe({
      next: (result: any) => {
        if (result.message != 'success')
          this.errorMessage = result.message;
        else {
          this.successMessage = 'An email has been sent to your address with instructions to reset your password.';
          this.isEmailSent = true;  // Set flag to true when email is sent successfully
        }
        //localStorage.setItem('cusCode', value.cusCode)
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = 'Failed to send email. Please try again.';
        console.error('mailing Failed: ', err);
        this.isLoading = false;  // Hide loading indicator
      }
    });
  }

  verifyCode() {
    this.authService.verifyOTP(this.email, this.code).subscribe({
      next: (verif: boolean) => {
        this.isVerified = verif; // Direct assignment (no .valueOf needed)
        console.log('OTP Verification Result:', verif);

        if (!verif)
          this.errorMessage = 'OTP verification failed. Please try again.';
        else {
          this.errorMessage = '';
          this.successMessage = 'OTP verified successfully!';

        }
      },
      error: (err) => {
        console.error('OTP Verification Failed:', err);
        this.errorMessage = 'OTP verification failed. Please try again.\n' + err.message;
        // Handle errors (e.g., show error message)
      }
    });
  }

  resetPassword() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.password != this.confirm)
      this.errorMessage = 'Passwords do not match';
    else {
      /* this.authService.getByEmail(this.email).subscribe({
        next: (value: any) => { */
          this.authService.resetPassword(this.email, this.password).subscribe(
            {
              next: (result: any) => {
                if (result.message == "success") {
                  this.successMessage = 'Password reset submitted'
                  localStorage.clear();
                  // Navigate to login or show success message
                  this.router.navigate(['/login']);
                }
              },
              error: (err) => {
                console.log(err);
                this.errorMessage = 'Failed to reset password. Please try again.';
              },
            }
          );
        /* }
      }) */
    }
  }
}


