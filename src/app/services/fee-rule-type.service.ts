import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeeRuleType } from '../entities/fee-rule-type';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeeRuleTypeService {
  private apiUrl = `${environment.apiUrl}/api/fee-rule-types`;

  constructor(private http: HttpClient) {}

  getAll(options?: { headers: HttpHeaders }): Observable<FeeRuleType[]> {
    return this.http.get<FeeRuleType[]>(this.apiUrl, options);
  }

  getById(id: number, options?: { headers: HttpHeaders }): Observable<FeeRuleType> {
    return this.http.get<FeeRuleType>(`${this.apiUrl}/${id}`, options);
  }

  create(feeRuleType: FeeRuleType, options?: { headers: HttpHeaders }): Observable<FeeRuleType> {
    return this.http.post<FeeRuleType>(this.apiUrl, feeRuleType, options);
  }

  update(id: number, feeRuleType: FeeRuleType, options?: { headers: HttpHeaders }): Observable<FeeRuleType> {
    return this.http.put<FeeRuleType>(`${this.apiUrl}/${id}`, feeRuleType, options);
  }

  delete(id: number, options?: { headers: HttpHeaders }): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, options);
  }

  search(word: string, options?: { headers: HttpHeaders }): Observable<FeeRuleType[]> {
    return this.http.get<FeeRuleType[]>(`${this.apiUrl}/search?word=${word}`, options);
  }
}