import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Card } from '../entities/card';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private apiUrl = `${environment.apiUrl}/api/cards`;

  constructor(private http: HttpClient) {}

  private getHeaders(isPublic: boolean = false): HttpHeaders {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role') || 'CUSTOMER';
    const rolesHeader = `ROLE_${role.toUpperCase()}`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Roles': rolesHeader
    });

    if (!isPublic && token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
      const role = localStorage.getItem('role') || 'CUSTOMER';
      headers = headers.set('X-Roles', `ROLE_${role.toUpperCase()}`);
    }
    

    return headers;
  }

  getAll(): Observable<Card[]> {
    return this.http.get<Card[]>(this.apiUrl, { withCredentials: true, headers: this.getHeaders(true) }).pipe(
      map(cards => cards.map(card => new Card(card))),
      catchError(error => {
        console.error('getAll: Error:', error);
        return throwError(() => new Error('Failed to fetch cards'));
      })
    );
  }

create(card: any): Observable<Card> {
  const cardData = {
    carNumb: card.carNumb,
    carLabe: card.carLabe,
    carExpiryDate: card.carExpiryDate,
    cardType: card.cardType,
    cardList: card.cardList,
    carAmount: card.carAmount,
    carPlafond: card.carPlafond,
    carPlafondPeriod: card.carPlafondPeriod
  };
  
  return this.http.post<Card>(this.apiUrl, cardData, { withCredentials: true, headers: this.getHeaders(true) }).pipe(
    map(createdCard => new Card(createdCard)),
    catchError(error => {
      console.error('create: Error:', error);
      
      // Enhanced error handling for duplicates
      if (error.status === 400 || error.status === 409 || 
          error.error?.message?.includes('already exists') ||
          error.message?.includes('already exists')) {
        return throwError(() => new Error('This card number is already registered in the system'));
      }
      
      return throwError(() => new Error(error.error?.message || 'Failed to create card'));
    })
  );
}

  update(carCode: number, card: Card): Observable<Card> {
    return this.http.put<Card>(`${this.apiUrl}/${carCode}`, card, { withCredentials: true, headers: this.getHeaders(true) }).pipe(
      map(updatedCard => new Card(updatedCard)),
      catchError(error => {
        console.error('update: Error:', error);
        return throwError(() => new Error('Failed to update card'));
      })
    );
  }

  delete(carCode: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${carCode}`, { withCredentials: true, headers: this.getHeaders(true) }).pipe(
      catchError(error => {
        console.error('delete: Error:', error);
        return throwError(() => new Error('Failed to delete card'));
      })
    );
  }

  searchCards(searchWord: string): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.apiUrl}/search?word=${encodeURIComponent(searchWord)}`, { withCredentials: true, headers: this.getHeaders(true) }).pipe(
      map(cards => cards.map(card => new Card(card))),
      catchError(error => {
        console.error('searchCards: Error:', error);
        return throwError(() => new Error('Failed to search cards'));
      })
    );
  }
}