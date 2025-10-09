// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Product } from '../entities/product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
    private apiUrl = `${environment.apiUrl}/api/products`;

  constructor(private http: HttpClient) {}

  getAllProducts(page: number = 1, size: number = 5, search: string = '', status: string = ''): Observable<{ products: Product[], total: number, page: number, size: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (search) params = params.set('q', search);
    if (status) params = params.set('status', status);
    
    return this.http.get<Product[]>(this.apiUrl, { params }).pipe(
      map(data => ({
        products: Array.isArray(data) ? data : [],
        total: Array.isArray(data) ? data.length : 0,
        page: page,
        size: size
      })),
      tap(response => console.log('getAllProducts transformed response:', response))
    );
  }

  getActiveProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/active`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      tap(response => console.log('createProduct response:', response))
    );
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  purchaseProduct(productId: number, customerWalletIden: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${productId}/purchase?customerWalletIden=${customerWalletIden}`, {});
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search?q=${query}`);
  }
}