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

  getAll(): Observable<FeeRuleType[]> {
    return this.http.get<FeeRuleType[]>(this.apiUrl, { withCredentials: true });
  }

  getById(id: number): Observable<FeeRuleType> {
    return this.http.get<FeeRuleType>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  create(feeRuleType: FeeRuleType): Observable<FeeRuleType> {
    return this.http.post<FeeRuleType>(this.apiUrl, feeRuleType, { withCredentials: true });
  }

  update(id: number, feeRuleType: FeeRuleType): Observable<FeeRuleType> {
    return this.http.put<FeeRuleType>(`${this.apiUrl}/${id}`, feeRuleType, { withCredentials: true });
  }

  delete(id: number, ): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  search(word: string, ): Observable<FeeRuleType[]> {
    return this.http.get<FeeRuleType[]>(`${this.apiUrl}/search?word=${word}`, { withCredentials: true });
  }
}