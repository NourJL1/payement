import { Injectable } from '@angular/core';
import { CustomerDoc } from '../entities/customer-doc';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerDocService {

  private apiUrl = `${environment.apiUrl}/api/customer-doc`;

  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getAll(): Observable<CustomerDoc[]> {
    return this.http.get<CustomerDoc[]>(this.apiUrl);
  }

  getById(id: number): Observable<CustomerDoc> {
    return this.http.get<CustomerDoc>(`${this.apiUrl}/${id}`);
  }

  getFileById(id: number) {
    return this.http.get(`${this.apiUrl}/file/${id}`, { responseType: 'blob' }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      
      window.open(url, '_blank',
        'width=800,menubar=no,toolbar=no,location=no,status=no');
    });
  }

  getByCustomerDocListe(cdlCode: number) {
    return this.http.get<CustomerDoc[]>(`${this.apiUrl}/cdl/${cdlCode}`);
  }

  create(customerDoc: CustomerDoc, file: File) {

    const formData = new FormData()
    formData.append('customerDoc', JSON.stringify(customerDoc))
    formData.append('file', file)
    return this.http.post<CustomerDoc>(this.apiUrl, formData);
  }

  update(id: number, customerDoc: CustomerDoc): Observable<CustomerDoc> {
    return this.http.put<CustomerDoc>(`${this.apiUrl}/${id}`, customerDoc, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  search(word: string): Observable<CustomerDoc[]> {
    return this.http.get<CustomerDoc[]>(`${this.apiUrl}/search?word=${word}`);
  }
}
