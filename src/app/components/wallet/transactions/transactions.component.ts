import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperationDetailsService } from '../../../services/operation-details.service';
import { OperationDetails } from '../../../entities/operation-details';
import { AuthService } from '../../../services/auth.service';
import { WalletService } from '../../../services/wallet.service';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent implements OnInit, AfterViewInit {
  transactions: OperationDetails[] = [];
  filteredTransactions: OperationDetails[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  
  // Filter states
  searchTerm: string = '';
  selectedDateRange: string = 'last30';
  selectedTransactionType: string = 'all';
  minAmount: number | null = null;
  maxAmount: number | null = null;
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalTransactions: number = 0;
Math: any;

  constructor(
    private operationDetailsService: OperationDetailsService,
    private authService: AuthService,
    private walletService: WalletService ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  // Add this method - it runs after the component's view has been initialized
  ngAfterViewInit(): void {
    this.setupDropdownHandlers();
  }

  // Add this private method to handle dropdown interactions
  private setupDropdownHandlers(): void {
    // Date filter dropdown
    const dateFilterButton = document.getElementById('dateFilterButton');
    const dateOptions = document.querySelectorAll('.date-option');

    if (dateFilterButton) {
      dateFilterButton.addEventListener('click', () => {
        const datePickerDropdown = document.querySelector('.date-picker-dropdown');
        datePickerDropdown?.classList.toggle('active');
        // Close other dropdowns
        document.querySelector('.type-dropdown')?.classList.remove('active');
        document.querySelector('.amount-dropdown')?.classList.remove('active');
        document.querySelector('.export-dropdown')?.classList.remove('active');
      });
    }

    dateOptions.forEach(option => {
      option.addEventListener('click', () => {
        const value = option.getAttribute('data-value');
        const text = option.textContent;
        if (value && dateFilterButton) {
          this.onDateRangeChange(value);
          const span = dateFilterButton.querySelector('span');
          if (span && text) {
            span.textContent = text;
          }
        }
        document.querySelector('.date-picker-dropdown')?.classList.remove('active');
      });
    });

    // Type filter dropdown
    const typeFilterButton = document.getElementById('typeFilterButton');
    const typeOptions = document.querySelectorAll('.type-option');

    if (typeFilterButton) {
      typeFilterButton.addEventListener('click', () => {
        const typeDropdown = document.querySelector('.type-dropdown');
        typeDropdown?.classList.toggle('active');
        // Close other dropdowns
        document.querySelector('.date-picker-dropdown')?.classList.remove('active');
        document.querySelector('.amount-dropdown')?.classList.remove('active');
        document.querySelector('.export-dropdown')?.classList.remove('active');
      });
    }

    typeOptions.forEach(option => {
      option.addEventListener('click', () => {
        const value = option.getAttribute('data-value');
        const text = option.textContent;
        if (value && typeFilterButton) {
          this.onTransactionTypeChange(value);
          const span = typeFilterButton.querySelector('span');
          if (span && text) {
            span.textContent = text;
          }
        }
        document.querySelector('.type-dropdown')?.classList.remove('active');
      });
    });

    // Amount filter dropdown
    const amountFilterButton = document.getElementById('amountFilterButton');
    
    if (amountFilterButton) {
      amountFilterButton.addEventListener('click', () => {
        const amountDropdown = document.querySelector('.amount-dropdown');
        amountDropdown?.classList.toggle('active');
        // Close other dropdowns
        document.querySelector('.date-picker-dropdown')?.classList.remove('active');
        document.querySelector('.type-dropdown')?.classList.remove('active');
        document.querySelector('.export-dropdown')?.classList.remove('active');
      });
    }

    // Apply amount range button
    const applyAmountButton = document.querySelector('.amount-dropdown button');
    if (applyAmountButton) {
      applyAmountButton.addEventListener('click', () => {
        const minInput = document.querySelector('.amount-dropdown input:first-child') as HTMLInputElement;
        const maxInput = document.querySelector('.amount-dropdown input:last-child') as HTMLInputElement;
        
        const min = minInput.value ? parseFloat(minInput.value) : null;
        const max = maxInput.value ? parseFloat(maxInput.value) : null;
        
        this.onAmountFilterChange(min, max);
        document.querySelector('.amount-dropdown')?.classList.remove('active');
      });
    }

    // Export dropdown
    const exportButton = document.getElementById('exportButton');
    
    if (exportButton) {
      exportButton.addEventListener('click', () => {
        const exportDropdown = document.querySelector('.export-dropdown');
        exportDropdown?.classList.toggle('active');
        // Close other dropdowns
        document.querySelector('.date-picker-dropdown')?.classList.remove('active');
        document.querySelector('.type-dropdown')?.classList.remove('active');
        document.querySelector('.amount-dropdown')?.classList.remove('active');
      });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#dateFilterContainer')) {
        document.querySelector('.date-picker-dropdown')?.classList.remove('active');
      }
      if (!target.closest('#typeFilterContainer')) {
        document.querySelector('.type-dropdown')?.classList.remove('active');
      }
      if (!target.closest('#amountFilterContainer')) {
        document.querySelector('.amount-dropdown')?.classList.remove('active');
      }
      if (!target.closest('#exportContainer')) {
        document.querySelector('.export-dropdown')?.classList.remove('active');
      }
    });
  }

  loadTransactions(): void {
  this.isLoading = true;

  // Get logged-in user info
  const cusCode = Number(this.authService.getCurrentUserId()); 
  const walIden = this.authService.getCurrentUserWalletId(); 

  console.log('Loading transactions for:', { cusCode, walIden });

  

  const filterTransactions = (data: OperationDetails[]) => {
  return data
    .filter(transaction => 
      // 1️⃣ Keep only transactions related to your wallet (sender OR recipient)
      (
        Number(transaction.odeCusCode) === cusCode || // you are sender
        transaction.odeRecipientWallet === walIden   // you are recipient
      ) &&
      // 2️⃣ Exclude fees & TVA
      transaction.odeType !== 'FEE' &&
      transaction.odeType !== 'TVA' &&
      // 3️⃣ (Optional) Ensure it is a wallet-related transaction
      (
        transaction.odeRecipientWallet === walIden ||
        transaction.odeIden?.includes(walIden) ||
        transaction.odePayMeth === 'WALLET_TO_WALLET'
      )
    )
    .map(transaction => {
      // Map type for UI
      if (transaction.odeType === 'CREDIT') transaction.odeType = 'income';
      else if (transaction.odeType === 'DEBIT') transaction.odeType = 'expense';
      else if (transaction.odeType === 'TRANSFER') transaction.odeType = 'transfer';

      transaction.odeValue = Number(transaction.odeValue).toString();
      return transaction;
    });
};





  this.operationDetailsService.getRecentTransactionsByCustomerAndWallet(cusCode, walIden, 720)
    .subscribe({
      next: (data) => {
        this.transactions = filterTransactions(data);
        this.filteredTransactions = [...this.transactions];
        this.totalTransactions = this.transactions.length;
        this.applyFilters();
        this.isLoading = false;

        console.log('Filtered transactions for this wallet:', this.transactions);
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.errorMessage = 'Failed to load transactions. Please try again later.';
        this.isLoading = false;

        // Fallback to wallet-based loading
        this.operationDetailsService.getTransactionsByWallet(walIden)
          .subscribe({
            next: (walletData) => {
              this.transactions = filterTransactions(walletData);
              this.filteredTransactions = [...this.transactions];
              this.totalTransactions = this.transactions.length;
              this.applyFilters();
              this.isLoading = false;

              console.log('Filtered wallet transactions:', this.transactions);
            },
            error: (walletError) => {
              console.error('Error loading wallet transactions:', walletError);
              this.errorMessage = 'Failed to load transactions from both endpoints.';
            }
          });
      }
    });
}

applyFilters(): void {
  let filtered = [...this.transactions];

  // Search filter
  if (this.searchTerm) {
    const term = this.searchTerm.toLowerCase();
    filtered = filtered.filter(transaction =>
      transaction.odeValue.toLowerCase().includes(term) ||
      (transaction.odeRecipientWallet && transaction.odeRecipientWallet.toLowerCase().includes(term)) ||
      transaction.odeType.toLowerCase().includes(term)
    );
  }

  // Transaction type filter
  if (this.selectedTransactionType !== 'all') {
    filtered = filtered.filter(transaction =>
      transaction.odeType.toLowerCase() === this.selectedTransactionType.toLowerCase()
    );
  }

  // Amount filter
  if (this.minAmount !== null) {
    filtered = filtered.filter(transaction =>
      parseFloat(transaction.odeValue) >= this.minAmount!
    );
  }
  if (this.maxAmount !== null) {
    filtered = filtered.filter(transaction =>
      parseFloat(transaction.odeValue) <= this.maxAmount!
    );
  }

  // Date filter
  if (this.selectedDateRange !== 'all') {
    const now = new Date();
    filtered = filtered.filter(transaction => {
      const txDate = new Date(transaction.odeCreatedAt);
      switch (this.selectedDateRange) {
        case 'today':
          return txDate.toDateString() === now.toDateString();
        case 'yesterday':
          const yesterday = new Date();
          yesterday.setDate(now.getDate() - 1);
          return txDate.toDateString() === yesterday.toDateString();
        case 'last7':
          const last7 = new Date();
          last7.setDate(now.getDate() - 7);
          return txDate >= last7;
        case 'last30':
          const last30 = new Date();
          last30.setDate(now.getDate() - 30);
          return txDate >= last30;
        case 'thisMonth':
          return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
        case 'lastMonth':
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          return txDate.getMonth() === lastMonth.getMonth() && txDate.getFullYear() === lastMonth.getFullYear();
        default:
          return true;
      }
    });
  }

  this.filteredTransactions = filtered;
  this.totalTransactions = filtered.length;
  this.currentPage = 1; // Reset pagination
}


  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  onDateRangeChange(range: string): void {
    this.selectedDateRange = range;
    this.applyFilters();
  }

  onTransactionTypeChange(type: string): void {
    this.selectedTransactionType = type;
    this.applyFilters();
  }

  onAmountFilterChange(min: number | null, max: number | null): void {
    this.minAmount = min;
    this.maxAmount = max;
    this.applyFilters();
  }

  get paginatedTransactions(): OperationDetails[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredTransactions.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  get totalPages(): number {
    return Math.ceil(this.totalTransactions / this.itemsPerPage);
  }
}