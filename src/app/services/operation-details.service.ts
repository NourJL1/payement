import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OperationDetails } from '../entities/operation-details';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperationDetailsService {

 private apiUrl = `${environment.apiUrl}/api/operation-details`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  getAll(): Observable<OperationDetails[]> {
    return this.http.get<OperationDetails[]>(this.apiUrl);
  }

  getById(id: number): Observable<OperationDetails> {
    return this.http.get<OperationDetails>(`${this.apiUrl}/${id}`);
  }

  create(operationDetails: OperationDetails): Observable<OperationDetails> {
    return this.http.post<OperationDetails>(this.apiUrl, operationDetails, this.httpOptions);
  }

  update(id: number, operationDetails: OperationDetails): Observable<OperationDetails> {
    return this.http.put<OperationDetails>(`${this.apiUrl}/${id}`, operationDetails, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  search(word: string): Observable<OperationDetails[]> {
    return this.http.get<OperationDetails[]>(`${this.apiUrl}/search?word=${word}`);
  }}
