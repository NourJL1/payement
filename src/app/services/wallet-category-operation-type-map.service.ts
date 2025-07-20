import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WalletCategoryOperationTypeMap } from '../entities/wallet-category-operation-type-map';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class WalletCategoryOperationTypeMapService {
private apiUrl = `${environment.apiUrl}/api/wallet-category-operation-type-map`;
  constructor(private http: HttpClient) {}

  private getHttpOptions(): { headers: HttpHeaders } {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role') || 'CUSTOMER';
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Roles': `ROLE_${role.toUpperCase()}`
    });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return { headers };
  }

  getAll(options?: { headers: HttpHeaders }): Observable<WalletCategoryOperationTypeMap[]> {
    // console.log('wcotmService.getAll: URL:', `${this.apiUrl}`, 'Options:', options);
    return this.http.get<WalletCategoryOperationTypeMap[]>(
      `${this.apiUrl}`,
      options
    );
  }

  getById(id: number): Observable<WalletCategoryOperationTypeMap> {
    return this.http.get<WalletCategoryOperationTypeMap>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

create(wcotm: WalletCategoryOperationTypeMap, options?: { headers: HttpHeaders }): Observable<WalletCategoryOperationTypeMap> {
  // console.log('wcotmService.create: URL:', this.apiUrl, 'Payload:', wcotm, 'Options:', options);
  return this.http.post<WalletCategoryOperationTypeMap>(
    `${this.apiUrl}`,
    wcotm,
    options
  );
}

  update(id: number, wcotm: WalletCategoryOperationTypeMap, options?: { headers: HttpHeaders }): Observable<WalletCategoryOperationTypeMap> {
    // console.log('wcotmService.update: URL:', `${this.apiUrl}/${id}`, 'Payload:', wcotm, 'Options:', options);
    return this.http.put<WalletCategoryOperationTypeMap>(
      `${this.apiUrl}/${id}`,
      wcotm,
      options
    );
  }

  delete(id: number, options?: { headers: HttpHeaders }): Observable<void> {
    // console.log('wcotmService.delete: URL:', `${this.apiUrl}/${id}`, 'Options:', options);
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      options
    );
  }

  search(word: string): Observable<WalletCategoryOperationTypeMap[]> {
    return this.http.get<WalletCategoryOperationTypeMap[]>(`${this.apiUrl}/search?word=${word}`, this.getHttpOptions());
  }
}