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
    return this.http.get<DocType[]>(this.apiUrl);
  }

  getById(id: number): Observable<DocType> {
    return this.http.get<DocType>(`${this.apiUrl}/${id}`);
  }

  create(docType: DocType): Observable<DocType> {
    return this.http.post<DocType>(this.apiUrl, docType, this.httpOptions);
  }

  update(id: number, docType: DocType): Observable<DocType> {
    return this.http.put<DocType>(`${this.apiUrl}/${id}`, docType, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  search(word: string): Observable<DocType[]> {
    return this.http.get<DocType[]>(`${this.apiUrl}/search?word=${word}`);
  }}
