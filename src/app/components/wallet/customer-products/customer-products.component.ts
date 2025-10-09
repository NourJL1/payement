// src/app/components/customer-products/customer-products.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../entities/product';

@Component({
  selector: 'app-customer-products',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './customer-products.component.html',
  styleUrls: ['./customer-products.component.css']
})
export class CustomerProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';
  customerWalletIden = 'WAL-123456'; // This should come from user session

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadActiveProducts();
  }

  loadActiveProducts(): void {
    this.productService.getActiveProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
      },
      error: (error) => console.error('Error loading products:', error)
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.productService.searchProducts(this.searchTerm).subscribe({
        next: (data) => this.filteredProducts = data,
        error: (error) => console.error('Error searching products:', error)
      });
    } else {
      this.filteredProducts = this.products;
    }
  }

  onPurchase(product: Product): void {
    if (confirm(`Purchase ${product.proName} for ${product.proPrice}?`)) {
      this.productService.purchaseProduct(product.proCode, this.customerWalletIden).subscribe({
        next: (response) => {
          alert('Purchase successful!');
          this.loadActiveProducts(); // Reload to update stock
        },
        error: (error) => {
          alert('Purchase failed: ' + (error.error?.message || 'Insufficient balance or product unavailable'));
        }
      });
    }
  }

  canPurchase(product: Product): boolean {
    return product.proIsActive && 
           (product.proStockQuantity === null || product.proStockQuantity > 0);
  }
}