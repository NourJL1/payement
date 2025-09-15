import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OperationTypeService } from '../../../services/operation-type.service';
import { OperationType } from '../../../entities/operation-type';
import { environment } from '../../../../environments/environment';
import { CustomerService } from '../../../services/customer.service';
import { AuthService } from '../../../services/auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

// Import jsPDF for PDF generation
import jsPDF from 'jspdf';

@Component({
  selector: 'app-transfer',
  imports: [CommonModule, FormsModule],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css'
})
export class TransferComponent implements OnInit {

  @ViewChild('qrCodeImg') qrCodeImg!: ElementRef;

  email?: string;

  // Form data
  senderWalletIden: string = '';
  receiverWalletIden: string = '';
  amount: number = 0;
  operationTypeIden: string = '';

  // QR Code specific fields
  currency: string = 'USD';
  transactionLabel: string = '';
  expiresAt: string = '';

  // OTP state
  isOtpSent: boolean = false;
  isOtpVerified: boolean = false;
  otpCode?: string;

  // UI state
  receiverInfo: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // QR Code state - CHANGED TO MODAL
  showQrModal: boolean = false;
  qrCodeImage: SafeUrl | null = null;
  isLoadingQr: boolean = false;
  qrExpiresAt: Date | null = null;

  // Data from backend
  operationTypes: OperationType[] = [];
  senderWalletBalance: number = 0;

  // API base URL
  private apiBaseUrl = environment.apiUrl || '';

  constructor(
    private http: HttpClient,
    private operationTypeService: OperationTypeService,
    private customerService: CustomerService,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadLoggedInUserWallet();
    this.loadOperationTypes();
    this.loadEmail();
  }

  loadEmail() {
    this.customerService.getEmail(parseInt(localStorage.getItem("cusCode")!)).subscribe({
      next: (res: any) => {
        this.email = res.email;
      },
      error: (err) => console.error('Failed to load email:', err)
    });
  }

  // Load the logged-in user's wallet information
  loadLoggedInUserWallet() {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (currentUser) {
        if (currentUser.wallet) {
          this.senderWalletIden = currentUser.wallet.walIden || 'WAL-unknown';
          this.senderWalletBalance = currentUser.wallet.walLogicBalance || currentUser.wallet.walEffBal || 0;
        } else {
          this.senderWalletIden = currentUser.walIden || 'WAL-unknown';
          this.senderWalletBalance = currentUser.walLogicBalance || currentUser.walEffBal || 0;
        }
      } else {
        this.senderWalletIden = 'WAL-not-logged-in';
      }
    } catch (e) {
      console.error('Error loading user wallet:', e);
      this.senderWalletIden = 'WAL-error';
    }
  }

  // Load available operation types from backend
  loadOperationTypes() {
    this.operationTypeService.getAll().subscribe({
      next: (types) => {
        this.operationTypes = types;
      },
      error: (error) => {
        console.error('Failed to load operation types:', error);
        this.errorMessage = 'Failed to load operation options';
        // Fallback options
        this.operationTypes = [
          { optIden: '2020', optLabe: 'WALLET TO WALLET', optCode: 3 } as OperationType,
          { optIden: 'OPT-003', optLabe: 'QR CODE', optCode: 4 } as OperationType,
          { optIden: 'OPT-BILL', optLabe: 'Bill Payment', optCode: 3 } as OperationType
        ];
      }
    });
  }

  // Find user by wallet ID
  findUser() {
    if (!this.receiverWalletIden) {
      this.errorMessage = 'Please enter a wallet ID';
      return;
    }
    //if (this.receiverWalletIden === this.senderWalletIden) {
      //this.errorMessage = 'Cannot transfer to your own wallet';
    //  return;
    //}
    if (this.receiverWalletIden.startsWith('WAL-') || this.receiverWalletIden.startsWith('WLT-')) {
      this.receiverInfo = `Wallet ID validated: ${this.receiverWalletIden}`;
      this.errorMessage = '';
    } else {
      this.receiverInfo = '';
      this.errorMessage = 'Please enter a valid wallet ID (should start with WAL- or WLT-)';
    }
  }

  // Use maximum available balance
  useMaxBalance() {
    this.amount = this.senderWalletBalance;
  }

  clearForm(clearMessages: boolean = true) {
    this.receiverWalletIden = '';
    this.amount = 0;
    this.operationTypeIden = '';
    this.receiverInfo = '';
    this.currency = 'USD';
    this.transactionLabel = '';
    this.expiresAt = '';
    this.otpCode = '';
    this.isOtpSent = false;
    this.isOtpVerified = false;
    this.showQrModal = false;
    this.qrCodeImage = null;
    this.qrExpiresAt = null;

    if (clearMessages) {
      this.errorMessage = '';
      this.successMessage = '';
    }
  }

  checkForm() {
    // Validation
    if (!this.receiverWalletIden) {
      this.errorMessage = 'Please enter a receiver wallet ID';
      return;
    }
    if (!this.amount || this.amount <= 0) {
      this.errorMessage = 'Please enter a valid amount';
      return;
    }
    if (!this.operationTypeIden) {
      this.errorMessage = 'Please select an operation type';
      return;
    }
    if (this.amount > this.senderWalletBalance) {
      this.errorMessage = 'Insufficient balance';
      return;
    }
  //  if (this.receiverWalletIden === this.senderWalletIden) {
    //  this.errorMessage = 'Cannot transfer to your own wallet';
    //  return;
  //  }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    // For QR code operations, generate QR code directly
    if (this.operationTypeIden === 'OPT-003') {
      this.generateQrCode();
    } else {
      this.sendOtp();
    }
  }

  sendOtp() {
    this.authService.sendEmail(this.email!, "confirm").subscribe({
      next: (result: any) => {
        if (result.message !== 'success') {
          this.errorMessage = result.message;
        } else {
          this.successMessage = 'An email has been sent to your address to verify.';
          this.isOtpSent = true;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to send email. Please try again.';
        console.error('mailing Failed: ', err);
        this.isLoading = false;
      }
    });
  }

  verifyOtp() {
    this.authService.verifyOTP(this.email!, this.otpCode!).subscribe({
      next: (verif: boolean) => {
        this.isOtpVerified = verif;
        if (!verif) {
          this.errorMessage = 'OTP verification failed. Please try again.';
        } else {
          this.errorMessage = '';
          this.successMessage = 'OTP verified successfully!';
          this.transferNow();
        }
      },
      error: (err) => {
        this.errorMessage = 'OTP verification failed. Please try again.\n' + err.message;
      }
    });
  }

  // Generate QR Code
  generateQrCode() {
    this.isLoadingQr = true;
    
    // Prepare QR request data
    const qrRequest = {
      receiverWalletIden: this.receiverWalletIden,
      amount: this.amount,
      currency: this.currency,
      label: this.transactionLabel,
      expiresAt: this.expiresAt ? new Date(this.expiresAt).getTime() : null
    };

    // Call the backend API to generate QR code
    this.http.post(`${this.apiBaseUrl}/api/qr/generate`, qrRequest, { 
      responseType: 'blob' 
    }).subscribe({
      next: (blob: Blob) => {
        const objectUrl = URL.createObjectURL(blob);
        this.qrCodeImage = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
        this.isLoadingQr = false;
        this.isLoading = false;
        this.showQrModal = true; // Changed to show modal instead of tab
        
        // Set expiration time for display
        if (qrRequest.expiresAt) {
          this.qrExpiresAt = new Date(qrRequest.expiresAt);
        }
        
        this.successMessage = 'QR code generated successfully!';
      },
      error: (error: HttpErrorResponse) => {
        console.error('Failed to generate QR code:', error);
        this.errorMessage = 'Failed to generate QR code. Please try again.';
        this.isLoadingQr = false;
        this.isLoading = false;
        
        // Fallback for demo mode
        if (error.status === 0 || error.status === 404) {
          this.demoGenerateQrCode();
        }
      }
    });
  }

  // Demo mode QR code generation
  demoGenerateQrCode() {
    // Create a demo QR code using a simple canvas approach
    const canvas = document.createElement('canvas');
    canvas.width = 250;
    canvas.height = 250;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Draw background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 250, 250);
      
      // Draw QR code pattern (simplified)
      ctx.fillStyle = '#000000';
      
      // Outer squares
      ctx.fillRect(50, 50, 30, 30);
      ctx.fillRect(170, 50, 30, 30);
      ctx.fillRect(50, 170, 30, 30);
      
      // Inner pattern
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if (Math.random() > 0.5) {
            ctx.fillRect(80 + i * 15, 80 + j * 15, 10, 10);
          }
        }
      }
      
      // Convert to image
      const dataUrl = canvas.toDataURL('image/png');
      this.qrCodeImage = this.sanitizer.bypassSecurityTrustUrl(dataUrl);
      this.showQrModal = true; // Changed to show modal instead of tab
      this.isLoadingQr = false;
      this.isLoading = false;
      
      // Set expiration time for display if provided
      if (this.expiresAt) {
        this.qrExpiresAt = new Date(this.expiresAt);
      }
      
      this.successMessage = 'Demo QR code generated successfully!';
    }
  }

  // Close QR modal
  closeQrModal() {
    this.showQrModal = false;
    this.qrCodeImage = null;
    this.qrExpiresAt = null;
  }

  // Prevent right-click to disable image saving
  preventRightClick(event: MouseEvent) {
    event.preventDefault();
    return false;
  }

  // Export as PDF (without QR code image)
  exportAsPdf() {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Payment Receipt', 105, 20, { align: 'center' });
    
    // Add transaction details
    doc.setFontSize(12);
    doc.text('Transaction Details:', 20, 40);
    
    doc.setFontSize(10);
    doc.text(`Receiver Wallet ID: ${this.receiverWalletIden}`, 20, 50);
    doc.text(`Amount: ${this.amount} ${this.currency}`, 20, 60);
    
    if (this.transactionLabel) {
      doc.text(`Label: ${this.transactionLabel}`, 20, 70);
    }
    
    if (this.qrExpiresAt) {
      doc.text(`Expires: ${this.qrExpiresAt.toLocaleString()}`, 20, 80);
    }
    
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 90);
    
    // Add security notice
    doc.setFontSize(8);
    doc.text('This is a secure transaction receipt. Keep it for your records.', 20, 110);
    
    // Save the PDF
    doc.save(`payment-receipt-${this.receiverWalletIden}.pdf`);
  }

  // Export QR code as PNG image
  exportQrAsImage() {
    if (!this.qrCodeImage) {
      this.errorMessage = 'No QR code available to export';
      return;
    }

    try {
      // Create a canvas to draw the QR code
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Set canvas dimensions
      canvas.width = 300;
      canvas.height = 350;
      
      // Draw white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw title
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Payment QR Code', canvas.width / 2, 25);
      
      // Draw QR code
      const img = new Image();
      img.onload = () => {
        // Draw QR code in the center
        const qrSize = 200;
        const qrX = (canvas.width - qrSize) / 2;
        const qrY = 40;
        ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
        
        // Draw transaction details below QR code
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Amount: ${this.amount} ${this.currency}`, canvas.width / 2, qrY + qrSize + 20);
        ctx.fillText(`To: ${this.receiverWalletIden}`, canvas.width / 2, qrY + qrSize + 40);
        
        if (this.transactionLabel) {
          ctx.fillText(`Label: ${this.transactionLabel}`, canvas.width / 2, qrY + qrSize + 60);
        }
        
        // Convert canvas to data URL and trigger download
        const dataUrl = canvas.toDataURL('image/png');
        this.downloadImage(dataUrl, `qr-code-${this.receiverWalletIden}.png`);
      };
      
      // Set image source (bypass security to get the actual URL)
      img.src = this.sanitizer.sanitize(4, this.qrCodeImage) || '';
    } catch (error) {
      console.error('Error exporting QR code:', error);
      this.errorMessage = 'Failed to export QR code. Please try again.';
    }
  }

  // Helper method to download image
  private downloadImage(dataUrl: string, filename: string) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Submit the transfer
  transferNow() {
    if (!this.isOtpVerified) {
      this.errorMessage = 'Please verify the OTP before transferring.';
      return;
    }

    this.isLoading = true;

    let transferRequest: any = {
      senderWalletIden: this.senderWalletIden,
      receiverWalletIden: this.receiverWalletIden,
      amount: this.amount,
      operationTypeIden: this.operationTypeIden
    };

    if (this.operationTypeIden === 'OPT-003') {
      transferRequest.currency = this.currency;
      transferRequest.transactionLabel = this.transactionLabel;
      transferRequest.expiresAt = this.expiresAt;
    }

    console.log('Sending transfer request:', transferRequest);
    this.tryTransferEndpoints(transferRequest);
  }

  private tryTransferEndpoints(transferRequest: any) {
    const endpoints = [
      `${this.apiBaseUrl}/api/transfer/wallet-to-wallet`,
      `${this.apiBaseUrl}/transfer/wallet-to-wallet`,
      `${this.apiBaseUrl}/api/wallet/transfer`,
      `${this.apiBaseUrl}/wallet/transfer`,
      '/api/transfer/wallet-to-wallet',
      '/transfer/wallet-to-wallet'
    ];

    let currentAttempt = 0;

    const tryNextEndpoint = () => {
      if (currentAttempt >= endpoints.length) {
        this.isLoading = false;
        this.errorMessage = 'Transfer service is currently unavailable. Please try again later.';
        return;
      }

      const endpoint = endpoints[currentAttempt];
      console.log(`Trying endpoint: ${endpoint}`);

      this.http.post<any>(endpoint, transferRequest).subscribe({
        next: (response) => this.handleTransferSuccess(response),
        error: (error: HttpErrorResponse) => {
          if (error.status === 404 && currentAttempt < endpoints.length - 1) {
            currentAttempt++;
            tryNextEndpoint();
          } else {
            this.handleTransferError(error);
          }
        }
      });
    };

    tryNextEndpoint();
  }

  private handleTransferSuccess(response: any) {
    this.isLoading = false;
    this.successMessage = `${response.message} Transaction ID: ${response.transactionId}`;

    if (response.totalDebited) {
      this.senderWalletBalance -= response.totalDebited;
    } else {
      this.senderWalletBalance -= this.amount;
    }

    this.clearForm(false); // Keep success message
  }

  private handleTransferError(error: HttpErrorResponse) {
    this.isLoading = false;
    this.errorMessage = error.error?.message || 'Transfer failed. Please try again.';
    console.error('Transfer error:', error);
  }

  demoTransfer() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = 'Transfer successful! Transaction ID: TXN-12345';
      this.senderWalletBalance -= this.amount;
      this.clearForm(false);
    }, 2000);
  }
}