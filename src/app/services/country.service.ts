import { Injectable } from '@angular/core';
import { Country } from '../entities/country';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

 private apiUrl = `${environment.apiUrl}/api/countries`;

  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getAll(): Observable<Country[]> {
    return this.http.get<Country[]>(this.apiUrl, { withCredentials: true });
  }

  getById(id: number): Observable<Country> {
    return this.http.get<Country>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  create(country: Country): Observable<Country> {
    return this.http.post<Country>(this.apiUrl, country, { withCredentials: true });
  }

  update(id: number, country: Country): Observable<Country> {
    return this.http.put<Country>(`${this.apiUrl}/${id}`, country, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  search(word: string): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiUrl}/search?word=${word}`, { withCredentials: true });
  }}
