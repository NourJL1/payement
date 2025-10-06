// src/app/components/admin-products/admin-products.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../entities/product';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css'],
  providers: [CurrencyPipe]
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  addForm: FormGroup;
  editForm: FormGroup;
  showAddModal = false;
  showEditModal = false;
  currentEditProduct: Product | null = null;
  currentPage = 1;
  pageSize = 5;
  totalItems = 0;
  searchTerm = '';
  statusFilter = '';

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private currencyPipe: CurrencyPipe,
    private cdr: ChangeDetectorRef
  ) {
    this.addForm = this.fb.group({
      proName: ['', Validators.required],
      proDescription: ['', Validators.required],
      proPrice: [0, [Validators.required, Validators.min(0)]],
      proStockQuantity: [0, [Validators.required, Validators.min(0)]],
      proIsActive: [false]
    });

    this.editForm = this.fb.group({
      proName: ['', Validators.required],
      proDescription: ['', Validators.required],
      proPrice: [0, [Validators.required, Validators.min(0)]],
      proStockQuantity: [0, [Validators.required, Validators.min(0)]],
      proIsActive: [false]
    });
  }

  ngOnInit(): void {
    console.log('ngOnInit: Loading products at', new Date().toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts(this.currentPage, this.pageSize, this.searchTerm, this.statusFilter).subscribe({
      next: (data) => {
        console.log('loadProducts data:', data);
        this.products = Array.isArray(data.products) ? data.products : [];
        this.filteredProducts = Array.isArray(data.products) ? data.products : [];
        this.totalItems = typeof data.total === 'number' ? data.total : 0;
        this.currentPage = typeof data.page === 'number' ? data.page : 1;
        console.log('Products:', this.products);
        console.log('Filtered Products:', this.filteredProducts);
        console.log('Total Items:', this.totalItems);
        console.log('Current Page:', this.currentPage);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        alert('Error loading products. Please try again.');
        this.products = [];
        this.filteredProducts = [];
        this.totalItems = 0;
        this.currentPage = 1;
        this.cdr.detectChanges();
      }
    });
  }

  filterProducts(): void {
    this.currentPage = 1;
    console.log('filterProducts: searchTerm=', this.searchTerm, 'statusFilter=', this.statusFilter);
    this.loadProducts();
  }

  openAddModal(): void {
    this.addForm.reset({ proIsActive: false });
    this.showAddModal = true;
    console.log('Opening add modal, showAddModal:', this.showAddModal);
    this.cdr.detectChanges();
  }

  closeAddModal(event?: MouseEvent): void {
    if (!event || event.target === event.currentTarget) {
      this.showAddModal = false;
      this.cdr.detectChanges();
    }
  }

  openEditModal(product: Product): void {
    this.currentEditProduct = product;
    this.editForm.setValue({
      proName: product.proName,
      proDescription: product.proDescription,
      proPrice: product.proPrice,
      proStockQuantity: product.proStockQuantity,
      proIsActive: product.proIsActive
    });
    this.showEditModal = true;
    this.cdr.detectChanges();
  }

  closeEditModal(event?: MouseEvent): void {
    if (!event || event.target === event.currentTarget) {
      this.showEditModal = false;
      this.currentEditProduct = null;
      this.cdr.detectChanges();
    }
  }

  onAddSubmit(): void {
    if (this.addForm.valid) {
      const newProduct: Partial<Product> = {
        ...this.addForm.value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.productService.createProduct(newProduct).subscribe({
        next: (response) => {
          console.log('Product added:', response);
          this.loadProducts();
          this.closeAddModal();
          alert('Product added successfully');
        },
        error: (error) => {
          console.error('Error creating product:', error);
          alert('Error creating product. Please try again.');
        }
      });
    }
  }

  onEditSubmit(): void {
    if (this.editForm.valid && this.currentEditProduct && this.currentEditProduct.proCode !== undefined) {
      const updatedProduct: Partial<Product> = {
        ...this.editForm.value,
        createdAt: this.currentEditProduct.createdAt,
        updatedAt: new Date().toISOString()
      };
      this.productService.updateProduct(this.currentEditProduct.proCode, updatedProduct).subscribe({
        next: () => {
          this.loadProducts();
          this.closeEditModal();
          alert('Product updated successfully');
        },
        error: (error) => {
          console.error('Error updating product:', error);
          alert('Error updating product. Please try again.');
        }
      });
    }
  }

  deleteProduct(proCode: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(proCode).subscribe({
        next: () => {
          this.loadProducts();
          alert('Product deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Error deleting product. Please try again.');
        }
      });
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      console.log('changePage: Navigating to page', page);
      this.loadProducts();
    }
  }

  get totalPages(): number {
    const pages = Math.ceil(this.totalItems / this.pageSize);
    return isNaN(pages) || pages < 1 ? 1 : pages;
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get paginationInfo(): string {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalItems);
    return this.totalItems > 0 ? `Showing ${start} to ${end} of ${this.totalItems} products` : 'No products found';
  }
}