import { Injectable } from '@angular/core';
import { City } from '../entities/city';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Country } from '../entities/country';

@Injectable({
  providedIn: 'root'
})
export class CityService {

 private apiUrl = `${environment.apiUrl}/api/cities`;

  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getAll(): Observable<City[]> {
    return this.http.get<City[]>(this.apiUrl);
  }

  getById(id: number): Observable<City> {
    return this.http.get<City>(`${this.apiUrl}/${id}`);
  }

  getByCountry(country: Country)
  {
    return this.http.get<City[]>(`${this.apiUrl}/getByCountry/${country.ctrCode}`)
  }

  create(city: City): Observable<City> {
    return this.http.post<City>(this.apiUrl, city, this.httpOptions);
  }

  update(id: number, city: City): Observable<City> {
    return this.http.put<City>(`${this.apiUrl}/${id}`, city, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  search(word: string): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiUrl}/search?word=${word}`);
  }}
