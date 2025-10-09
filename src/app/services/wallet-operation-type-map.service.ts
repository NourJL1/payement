// In wallet-operation-type-map.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WalletOperationTypeMap } from '../entities/wallet-operation-type-map';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WalletOperationTypeMapService {
  private apiUrl = `${environment.apiUrl}/api/wallet-operation-type-map`;

  constructor(private http: HttpClient) {}

  getAll(httpOptions: { headers: HttpHeaders }): Observable<WalletOperationTypeMap[]> {
    return this.http.get<WalletOperationTypeMap[]>(this.apiUrl, { withCredentials: true });
  }

  getById(id: number): Observable<WalletOperationTypeMap> {
    return this.http.get<WalletOperationTypeMap>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  create(mapping: WalletOperationTypeMap): Observable<WalletOperationTypeMap> {
    return this.http.post<WalletOperationTypeMap>(this.apiUrl, mapping, { withCredentials: true });
  }

  update(id: number, mapping: WalletOperationTypeMap): Observable<WalletOperationTypeMap> {
    return this.http.put<WalletOperationTypeMap>(`${this.apiUrl}/${id}`, mapping, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  search(word: string): Observable<WalletOperationTypeMap[]> {
    return this.http.get<WalletOperationTypeMap[]>(`${this.apiUrl}/search?word=${word}`, { withCredentials: true });
  }
}