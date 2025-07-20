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
    return this.http.get<WalletOperationTypeMap[]>(this.apiUrl, httpOptions);
  }

  getById(id: number, httpOptions: { headers: HttpHeaders }): Observable<WalletOperationTypeMap> {
    return this.http.get<WalletOperationTypeMap>(`${this.apiUrl}/${id}`, httpOptions);
  }

  create(mapping: WalletOperationTypeMap, httpOptions: { headers: HttpHeaders }): Observable<WalletOperationTypeMap> {
    return this.http.post<WalletOperationTypeMap>(this.apiUrl, mapping, httpOptions);
  }

  update(id: number, mapping: WalletOperationTypeMap, httpOptions: { headers: HttpHeaders }): Observable<WalletOperationTypeMap> {
    return this.http.put<WalletOperationTypeMap>(`${this.apiUrl}/${id}`, mapping, httpOptions);
  }

  delete(id: number, httpOptions: { headers: HttpHeaders }): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, httpOptions);
  }

  search(word: string, httpOptions: { headers: HttpHeaders }): Observable<WalletOperationTypeMap[]> {
    return this.http.get<WalletOperationTypeMap[]>(`${this.apiUrl}/search?word=${word}`, httpOptions);
  }
}