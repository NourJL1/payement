import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WalletOperations } from '../entities/wallet-operations';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WalletOperationsService {

private apiUrl = `${environment.apiUrl}/api/wallet-operations`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  getAll(): Observable<WalletOperations[]> {
    return this.http.get<WalletOperations[]>(this.apiUrl);
  }

  getById(id: number): Observable<WalletOperations> {
    return this.http.get<WalletOperations>(`${this.apiUrl}/${id}`);
  }

  create(operation: WalletOperations): Observable<WalletOperations> {
    return this.http.post<WalletOperations>(this.apiUrl, operation, this.httpOptions);
  }

  update(id: number, operation: WalletOperations): Observable<WalletOperations> {
    return this.http.put<WalletOperations>(`${this.apiUrl}/${id}`, operation, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  search(word: string): Observable<WalletOperations[]> {
    return this.http.get<WalletOperations[]>(`${this.apiUrl}/search?word=${word}`);
  }}
