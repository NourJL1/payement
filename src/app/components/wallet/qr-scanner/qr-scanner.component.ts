import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DatePipe],
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.css']
})
export class QrScannerComponent {
  qrForm: FormGroup;
  selectedFile: File | null = null;
  qrData: any = null;
  isLoading = false;
  paymentResult: any = null;
  errorMessage: string | null = null;

  private apiBaseUrl = environment.apiUrl || '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.qrForm = this.fb.group({
      senderWalletIden: ['', Validators.required]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.scanQRCode(file);
    }
  }

  scanQRCode(file: File): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.qrData = null;
    
    console.log('Starting QR scan...');
    
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<any>(`${this.apiBaseUrl}/api/qr/decode`, formData).subscribe({
      next: (response) => {
        console.log('QR decode response:', response);
        try {
          this.qrData = JSON.parse(response.data);
          // Ensure amount is a string for BigDecimal compatibility
          if (this.qrData.amount) {
            this.qrData.amount = String(this.qrData.amount);
          }
          console.log('Parsed QR data:', this.qrData);
          this.isLoading = false;
        } catch (error) {
          console.error('Error parsing QR data:', error);
          this.handleError('Invalid QR code format: ' + error);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('QR decode error:', error);
        this.handleApiError(error);
      }
    });
  }

  private handleApiError(error: HttpErrorResponse): void {
    this.isLoading = false;
    
    if (error.status === 400 && error.error && error.error.message) {
      this.errorMessage = error.error.message;
    } else if (error.status === 406) {
      this.errorMessage = 'Content type not acceptable. Please ensure the request is sent as JSON.';
    } else if (error.status === 404) {
      this.errorMessage = 'API endpoint not found. Please make sure the backend server is running on port 8081.';
    } else if (error.status === 415) {
      this.errorMessage = 'Unsupported media type. Please try a different image format.';
    } else if (error.error instanceof ErrorEvent) {
      this.errorMessage = `Error: ${error.error.message}`;
    } else {
      this.errorMessage = `Server error: ${error.status} - ${error.message}`;
    }
    
    console.error('API Error:', error);
  }

  private handleError(message: string): void {
    this.isLoading = false;
    this.errorMessage = message;
    console.error(message);
  }

  processPayment(): void {
    if (!this.qrData || !this.qrForm.valid || !this.selectedFile) {
      this.errorMessage = 'Please upload a valid QR code and enter your wallet ID';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    const senderWalletIden = this.qrForm.get('senderWalletIden')?.value;
    
    const paymentRequest: QRPaymentRequest = {
      receiverWalletIden: this.qrData.receiverWalletIden,
      amount: this.qrData.amount, // Already converted to string
      currency: this.qrData.currency,
      label: this.qrData.label,
      expiresAt: this.qrData.expiresAt
    };

    console.log('Sending transfer request:', paymentRequest);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    this.http.post<QRPaymentResponse>(
      `${this.apiBaseUrl}/api/qr/transfer/${senderWalletIden}`, 
      paymentRequest,
      { headers }
    ).subscribe({
      next: (response) => {
        console.log('Transfer response:', response);
        this.paymentResult = response;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Transfer error:', error);
        this.handleApiError(error);
      }
    });
  }
}

interface QRPaymentRequest {
  receiverWalletIden: string;
  amount: string; // Changed to string for BigDecimal compatibility
  currency: string;
  label?: string;
  expiresAt?: number;
}

interface QRPaymentResponse {
  transactionId: string;
  status: string;
  message: string;
}