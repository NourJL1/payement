import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    localStorage.clear()
  }

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {

        localStorage.setItem("username", response.username)
        localStorage.setItem("fullname", response.fullname)
        localStorage.setItem("authorities", response.authorities)

        switch (response.authorities[0]) {
          case "ROLE_USER":
            localStorage.setItem("useCode", response.useCode)
            this.router.navigate(["/admin"])
            break;
          case "ROLE_CUSTOMER":
            localStorage.setItem("cusCode", response.cusCode)
            localStorage.setItem("status", response.status)
            switch (response.status) {
              case "SUSPENDED":
                this.router.navigate(["/suspended"])
                break;
              case "PENDING":
                this.router.navigate(["/pending"])
                break;
              case "ACTIVE":
                this.router.navigate(["/wallet"])
                break;
            }
            break;
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMessage = 'Login failed. Please check your credentials.';
        this.isLoading = false; // Hide loading indicator after completion
      }
    })
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
