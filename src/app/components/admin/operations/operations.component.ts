import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface OperationType {
  optIden: string;
  optLabe: string;
  optCode: number;
  optFscIden?: number;
  optFscLab?: string;
}

interface WalletTransferRequest {
  operationTypeIden: string;
  senderWalletIden: string;
  receiverWalletIden: string;
  amount: number;
}

interface WalletTransferResponse {
  transactionId: string;
  totalDebited: number;
  message: string;
}

interface QRPaymentRequest {
  receiverWalletIden: string;
  amount: number;
  currency: string;
  label?: string;
  expiresAt?: number;
}

interface QRPaymentResponse {
  transactionId: string;
  status: string;
  message: string;
}

interface CustomerData {
  [key: string]: {
    name: string;
    balance: number;
  };
}

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})
export class OperationsComponent implements OnInit {
  operationTypes: OperationType[] = [];
  selectedType: string = '';
  selectedOperationType: OperationType | null = null;
  accountNumber: string = '';
  senderWallet: string = '';
  customerName: string = '';
  amount: string = '';
  recipientAccount: string = '';
  purpose: string = '';
  
  // For QR code functionality
  qrCodeImage: SafeUrl | null = null;
  isGeneratingQR: boolean = false;
  selectedFile: File | null = null;
  
  // Validation states
  accountValid: boolean = false;
  accountLoading: boolean = false;
  walletValid: boolean = false;
  
  // API endpoints
  private apiBaseUrl = 'http://localhost:8081'; // Update with your backend URL
  private operationTypesEndpoint = `${this.apiBaseUrl}/api/operation-types`;
  private walletTransferEndpoint = `${this.apiBaseUrl}/api/transfer/wallet-to-wallet`;
  private qrGenerateEndpoint = `${this.apiBaseUrl}/api/qr/generate`;
  private qrPayEndpoint = `${this.apiBaseUrl}/api/qr/pay`;
  private qrDecodeEndpoint = `${this.apiBaseUrl}/api/qr/decode`;

  // Mock customer data (replace with API call)
  customerData: CustomerData = {
    '1001234567': { name: 'John Mitchell', balance: 5420.50 },
    '1001234568': { name: 'Sarah Johnson', balance: 12350.75 },
    '1001234569': { name: 'Michael Chen', balance: 8900.25 },
    '1001234570': { name: 'Emily Rodriguez', balance: 15600.00 }
  };

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadOperationTypes();
  }

  // Helper methods to use in template
  isNaN(value: any): boolean {
    return Number.isNaN(Number(value));
  }

  parseFloat(value: string): number {
    return parseFloat(value);
  }

  loadOperationTypes() {
    this.http.get<OperationType[]>(this.operationTypesEndpoint).subscribe({
      next: (types) => {
        this.operationTypes = types;
      },
      error: (error) => {
        console.error('Failed to load operation types', error);
        this.showToast('error', 'Error', 'Failed to load transaction types');
        
        // Fallback to mock data if API fails - using the actual optIden values from your backend
        this.operationTypes = [
          { optIden: 'OPT-001', optLabe: 'Deposit', optCode: 1 },
          { optIden: 'OPT-002', optLabe: 'Withdrawal', optCode: 2 },
          { optIden: 'OPT-003', optLabe: 'Transfer', optCode: 3 },
          { optIden: 'OPT-004', optLabe: 'Wallet Transfer', optCode: 4 },
          { optIden: 'OPT-005', optLabe: 'Card Payment', optCode: 5 },
          { optIden: 'OPT-006', optLabe: 'QR Payment', optCode: 6 }
        ];
      }
    });
  }

  selectTransactionType(type: OperationType) {
    this.selectedType = type.optIden;
    this.selectedOperationType = type;
    
    // Show/hide recipient field based on transaction type
    const recipientField = document.getElementById('recipient-field');
    const recipientLabel = document.getElementById('recipient-label');
    const recipientAccount = document.getElementById('recipient-account') as HTMLInputElement;
    
    if (recipientField && recipientLabel && recipientAccount) {
      if (type.optIden === 'OPT-003') { // Transfer
        recipientField.classList.remove('hidden');
        recipientLabel.textContent = 'Recipient Account Number';
        recipientAccount.placeholder = 'Enter recipient account number';
      } else if (type.optIden === 'OPT-004') { // Wallet Transfer
        recipientField.classList.remove('hidden');
        recipientLabel.textContent = 'Recipient Wallet ID';
        recipientAccount.placeholder = 'Enter recipient wallet ID';
      } else {
        recipientField.classList.add('hidden');
      }
    }
    
    this.validateForm();
  }

  onAccountNumberInput() {
    const value = this.accountNumber.trim();
    this.accountValid = false;
    this.accountLoading = false;
    this.customerName = '';
    
    if (value.length >= 10) {
      this.accountLoading = true;
      
      // Simulate API call with timeout
      setTimeout(() => {
        this.accountLoading = false;
        
        if (this.customerData[value]) {
          this.accountValid = true;
          this.customerName = this.customerData[value].name;
        }
        
        this.validateForm();
      }, 800);
    } else {
      this.validateForm();
    }
  }

  onAmountInput() {
    this.validateForm();
  }

  onWalletInput() {
    const value = this.senderWallet.trim();
    this.walletValid = false;
    
    if (value.length >= 8) {
      this.walletValid = /^W\d{7}$/.test(value);
    }
    
    this.validateForm();
  }

  validateForm() {
    const isAccountValid = this.accountNumber && this.customerData[this.accountNumber];
    const isWalletValid = this.senderWallet && /^W\d{7}$/.test(this.senderWallet);
    const isAmountValid = this.amount && !this.isNaN(this.amount) && this.parseFloat(this.amount) > 0;
    
    let isRecipientValid = true;
    if (this.selectedType === 'OPT-003' || this.selectedType === 'OPT-004') {
      isRecipientValid = !!this.recipientAccount.trim();
    }
    
    const processButton = document.getElementById('process-transaction') as HTMLButtonElement;
    if (processButton) {
      processButton.disabled = !(this.selectedType && isAccountValid && isWalletValid && isAmountValid && isRecipientValid);
    }
  }

  processTransaction() {
    if (this.selectedType === 'OPT-004') { // Wallet Transfer
      this.processWalletTransfer();
    } else if (this.selectedType === 'OPT-006') { // QR Payment
      this.processQRPayment();
    } else {
      // For other transaction types, show confirmation modal
      this.showConfirmationModal();
    }
  }

  processWalletTransfer() {
    const request: WalletTransferRequest = {
      operationTypeIden: this.selectedType,
      senderWalletIden: this.senderWallet,
      receiverWalletIden: this.recipientAccount,
      amount: this.parseFloat(this.amount)
    };

    this.http.post<WalletTransferResponse>(this.walletTransferEndpoint, request).subscribe({
      next: (response) => {
        this.showToast('success', 'Success', `Transfer completed. Reference: ${response.transactionId}`);
        this.clearForm();
      },
      error: (error) => {
        console.error('Transfer failed', error);
        this.showToast('error', 'Error', 'Transfer failed: ' + (error.error?.message || error.message));
      }
    });
  }

  processQRPayment() {
    const request: QRPaymentRequest = {
      receiverWalletIden: this.recipientAccount,
      amount: this.parseFloat(this.amount),
      currency: 'TND',
      label: this.purpose
    };

    this.http.post<QRPaymentResponse>(`${this.qrPayEndpoint}/${this.senderWallet}`, request).subscribe({
      next: (response) => {
        this.showToast('success', 'Success', `QR Payment completed. Reference: ${response.transactionId}`);
        this.clearForm();
      },
      error: (error) => {
        console.error('QR Payment failed', error);
        this.showToast('error', 'Error', 'QR Payment failed: ' + (error.error?.message || error.message));
      }
    });
  }

  generateQRCode() {
    this.isGeneratingQR = true;
    const request: QRPaymentRequest = {
      receiverWalletIden: this.recipientAccount,
      amount: this.parseFloat(this.amount),
      currency: 'TND',
      label: this.purpose,
      expiresAt: Date.now() + 3600000 // 1 hour from now
    };

    this.http.post(this.qrGenerateEndpoint, request, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.qrCodeImage = this.sanitizer.bypassSecurityTrustUrl(url);
        this.isGeneratingQR = false;
      },
      error: (error) => {
        console.error('QR generation failed', error);
        this.isGeneratingQR = false;
        this.showToast('error', 'Error', 'QR generation failed');
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.decodeQRCode();
    }
  }

  decodeQRCode() {
    if (!this.selectedFile) return;
    
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    
    this.http.post<{data: string}>(this.qrDecodeEndpoint, formData).subscribe({
      next: (response) => {
        try {
          const qrData = JSON.parse(response.data);
          this.recipientAccount = qrData.receiverWalletIden || '';
          this.amount = qrData.amount?.toString() || '';
          this.purpose = qrData.label || '';
          this.showToast('success', 'QR Decoded', 'QR code data loaded successfully');
        } catch (e) {
          this.showToast('error', 'Error', 'Invalid QR code format');
        }
      },
      error: (error) => {
        console.error('QR decoding failed', error);
        this.showToast('error', 'Error', 'Failed to decode QR code');
      }
    });
  }

  clearForm() {
    this.accountNumber = '';
    this.senderWallet = '';
    this.customerName = '';
    this.amount = '';
    this.recipientAccount = '';
    this.purpose = '';
    this.selectedType = '';
    this.selectedOperationType = null;
    this.qrCodeImage = null;
    this.accountValid = false;
    this.walletValid = false;
    
    // Reset UI elements
    const typeCards = document.querySelectorAll('.transaction-type-card');
    typeCards.forEach(card => {
      card.classList.remove('border-primary', 'bg-primary/5');
      card.classList.add('border-gray-200');
    });
    
    const recipientField = document.getElementById('recipient-field');
    if (recipientField) {
      recipientField.classList.add('hidden');
    }
    
    const processButton = document.getElementById('process-transaction') as HTMLButtonElement;
    if (processButton) {
      processButton.disabled = true;
    }
  }

  showConfirmationModal() {
    const modal = document.getElementById('confirmation-modal');
    if (!modal) return;
    
    const typeText = this.selectedOperationType ? this.selectedOperationType.optLabe : this.selectedType;
    
    const confirmType = document.getElementById('confirm-type');
    const confirmCustomer = document.getElementById('confirm-customer');
    const confirmAccount = document.getElementById('confirm-account');
    const confirmWallet = document.getElementById('confirm-wallet');
    const confirmAmount = document.getElementById('confirm-amount');
    const confirmRecipientRow = document.getElementById('confirm-recipient-row');
    const confirmRecipient = document.getElementById('confirm-recipient');
    
    if (confirmType) confirmType.textContent = typeText;
    if (confirmCustomer) confirmCustomer.textContent = this.customerName;
    if (confirmAccount) confirmAccount.textContent = this.accountNumber;
    if (confirmWallet) confirmWallet.textContent = this.senderWallet;
    if (confirmAmount) confirmAmount.textContent = '$' + this.parseFloat(this.amount).toFixed(2);
    
    if (confirmRecipientRow && confirmRecipient) {
      if (this.selectedType === 'OPT-003' || this.selectedType === 'OPT-004') {
        confirmRecipientRow.style.display = 'flex';
        confirmRecipient.textContent = this.recipientAccount;
      } else {
        confirmRecipientRow.style.display = 'none';
      }
    }
    
    modal.classList.remove('hidden');
  }

  hideConfirmationModal() {
    const modal = document.getElementById('confirmation-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  confirmTransaction() {
    this.hideConfirmationModal();
    
    if (this.selectedType === 'OPT-004') { // Wallet Transfer
      this.processWalletTransfer();
    } else if (this.selectedType === 'OPT-006') { // QR Payment
      this.processQRPayment();
    } else {
      // Simulate processing for other transaction types
      const processButton = document.getElementById('confirm-transaction') as HTMLButtonElement;
      if (processButton) {
        processButton.innerHTML = '<i class="ri-loader-4-line animate-spin mr-2"></i>Processing...';
        processButton.disabled = true;
        
        setTimeout(() => {
          const referenceNumber = 'TXN' + Date.now().toString().slice(-8);
          this.showToast('success', 'Transaction Completed', 'Transaction processed successfully', 'Reference: ' + referenceNumber);
          processButton.innerHTML = 'Confirm Transaction';
          processButton.disabled = false;
          this.clearForm();
        }, 2000);
      }
    }
  }

  showToast(type: string, title: string, message: string, reference: string = '') {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toast-icon');
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');
    const toastReference = document.getElementById('toast-reference');
    
    if (!toast || !toastIcon || !toastTitle || !toastMessage || !toastReference) return;
    
    if (type === 'success') {
      toastIcon.className = 'ri-check-line text-green-500';
    } else {
      toastIcon.className = 'ri-close-line text-red-500';
    }
    
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    toastReference.textContent = reference;
    
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 5000);
  }

  getIconForType(typeLabel: string): string {
    const icons: {[key: string]: string} = {
      'Deposit': 'ri-arrow-down-line text-primary text-xl',
      'Withdrawal': 'ri-arrow-up-line text-primary text-xl',
      'Transfer': 'ri-exchange-line text-primary text-xl',
      'Wallet Transfer': 'ri-wallet-3-line text-primary text-xl',
      'Card Payment': 'ri-bank-card-line text-primary text-xl',
      'QR Payment': 'ri-qr-code-line text-primary text-xl'
    };
    return icons[typeLabel] || 'ri-bank-line text-primary text-xl';
  }

  getDescriptionForType(typeLabel: string): string {
    const descriptions: {[key: string]: string} = {
      'Deposit': 'Add funds to customer account',
      'Withdrawal': 'Remove funds from account',
      'Transfer': 'Transfer to external account',
      'Wallet Transfer': 'Transfer between wallets',
      'Card Payment': 'Pay via credit/debit card',
      'QR Payment': 'Pay using QR code'
    };
    return descriptions[typeLabel] || 'Process transaction';
  }

  // Check if a transaction type is selected
  isSelectedType(type: OperationType): boolean {
    return this.selectedType === type.optIden;
  }
}