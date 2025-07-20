import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Bank} from '../entities/bank';



@Injectable({
  providedIn: 'root'
})
export class BankService {

 private apiUrl = `${environment.apiUrl}/api/banks`;

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
  }

  create(bank: Bank): Observable<Bank> {
    return this.http.post<Bank>(this.apiUrl, bank, this.getHttpOptions());
  }

  update(id: number, bank: Bank): Observable<Bank> {
    return this.http.put<Bank>(`${this.apiUrl}/${id}`, bank, this.getHttpOptions());
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  getById(id: number): Observable<Bank> {
    return this.http.get<Bank>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  getAll(): Observable<Bank[]> {
    return this.http.get<Bank[]>(this.apiUrl, this.getHttpOptions());
  }

  searchBanks(searchWord: string): Observable<Bank[]> {
    return this.http.get<Bank[]>(`${this.apiUrl}/search?word=${searchWord}`, this.getHttpOptions());
  }}
