import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CardType } from '../entities/card-type';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CardTypeService {
  private apiUrl = `${environment.apiUrl}/api/card-types`;

  constructor(private http: HttpClient) {}

  private getHeaders(isPublic: boolean = false): HttpHeaders {
    const token = localStorage.getItem('authToken');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json' // Explicitly request JSON response
    });

    if (!isPublic && token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
      const role = localStorage.getItem('role') || 'CUSTOMER';
      headers = headers.set('X-Roles', `ROLE_${role.toUpperCase()}`);
    }

    return headers;
  }

  findAll(): Observable<CardType[]> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders(true), responseType: 'json' }).pipe(
      map((response: any) => (response as CardType[]).map(cardType => new CardType(cardType))),
      catchError(error => {
        console.error('findAll: Error:', error);
        return throwError(() => new Error(`Failed to fetch card types: ${error.status} ${error.statusText || 'Unknown error'}`));
      })
    );
  }

  save(cardType: CardType): Observable<CardType> {
    const url = cardType.ctypCode ? `${this.apiUrl}/${cardType.ctypCode}` : this.apiUrl;
    const method = cardType.ctypCode ? 'put' : 'post';
    return this.http.request<CardType>(method, url, {
      body: cardType,
      headers: this.getHeaders(true),
      responseType: 'json'
    }).pipe(
      map(savedCardType => new CardType(savedCardType)),
      catchError(error => {
        console.error('save: Error:', error);
        return throwError(() => new Error(`Failed to save card type: ${error.status} ${error.statusText || 'Unknown error'}`));
      })
    );
  }

  deleteById(ctypCode: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${ctypCode}`, { headers: this.getHeaders(true), responseType: 'json' }).pipe(
      catchError(error => {
        console.error('deleteById: Error:', error);
        return throwError(() => new Error(`Failed to delete card type: ${error.status} ${error.statusText || 'Unknown error'}`));
      })
    );
  }

  // Add this method to your CardTypeService
searchCardTypes(searchWord: string): Observable<CardType[]> {
  return this.http.get<CardType[]>(`${this.apiUrl}/search?word=${encodeURIComponent(searchWord)}`, { 
    headers: this.getHeaders(true) 
  }).pipe(
    map(cardTypes => cardTypes.map(cardType => new CardType(cardType))),
    catchError(error => {
      console.error('searchCardTypes: Error:', error);
      return throwError(() => new Error('Failed to search card types'));
    })
  );
}
}