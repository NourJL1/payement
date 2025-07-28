import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CardList } from '../entities/card-list';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CardListService {
  private apiUrl = `${environment.apiUrl}/api/card-lists`;

  constructor(private http: HttpClient) {}

  private getHeaders(isPublic: boolean = false): HttpHeaders {
    const token = localStorage.getItem('authToken');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (!isPublic && token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
      const role = localStorage.getItem('role') || 'CUSTOMER';
      headers = headers.set('X-Roles', `ROLE_${role.toUpperCase()}`);
    }

    return headers;
  }

  getAll(): Observable<CardList[]> {
    return this.http.get<CardList[]>(this.apiUrl, { headers: this.getHeaders(true) }).pipe(
      map(cardLists => cardLists.map(cardList => new CardList(cardList))),
      catchError(error => {
        console.error('getAll: Error:', error);
        return throwError(() => new Error('Failed to fetch card lists'));
      })
    );
  }

  create(cardList: CardList): Observable<CardList> {
    return this.http.post<CardList>(this.apiUrl, cardList, { headers: this.getHeaders(true) }).pipe(
      map(createdCardList => new CardList(createdCardList)),
      catchError(error => {
        console.error('create: Error:', error);
        return throwError(() => new Error('Failed to create card list'));
      })
    );
  }

  update(cliCode: number, cardList: CardList): Observable<CardList> {
    return this.http.put<CardList>(`${this.apiUrl}/${cliCode}`, cardList, { headers: this.getHeaders(true) }).pipe(
      map(updatedCardList => new CardList(updatedCardList)),
      catchError(error => {
        console.error('update: Error:', error);
        return throwError(() => new Error('Failed to update card list'));
      })
    );
  }

  delete(cliCode: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cliCode}`, { headers: this.getHeaders(true) }).pipe(
      catchError(error => {
        console.error('delete: Error:', error);
        return throwError(() => new Error('Failed to delete card list'));
      })
    );
  }

  // Add this method to your CardListService
searchCardLists(searchWord: string): Observable<CardList[]> {
  return this.http.get<CardList[]>(`${this.apiUrl}/search?word=${encodeURIComponent(searchWord)}`, { 
    headers: this.getHeaders(true) 
  }).pipe(
    map(cardLists => cardLists.map(cardList => new CardList(cardList))),
    catchError(error => {
      console.error('searchCardLists: Error:', error);
      return throwError(() => new Error('Failed to search card lists'));
    })
  );
}
}