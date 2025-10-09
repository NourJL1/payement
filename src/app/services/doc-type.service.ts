import { Injectable } from '@angular/core';
import { DocType } from '../entities/doc-type';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocTypeService {

private apiUrl = `${environment.apiUrl}/api/doc-type`;

  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getAll(): Observable<DocType[]> {
    return this.http.get<DocType[]>(this.apiUrl, { withCredentials: true });
  }

  getById(id: number): Observable<DocType> {
    return this.http.get<DocType>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  create(docType: DocType): Observable<DocType> {
    return this.http.post<DocType>(this.apiUrl, docType, { withCredentials: true });
  }

  update(id: number, docType: DocType): Observable<DocType> {
    return this.http.put<DocType>(`${this.apiUrl}/${id}`, docType, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  search(word: string): Observable<DocType[]> {
    return this.http.get<DocType[]>(`${this.apiUrl}/search?word=${word}`, { withCredentials: true });
  }}
