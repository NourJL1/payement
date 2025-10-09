import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
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
    return this.http.get<OperationDetails[]>(this.apiUrl, { withCredentials: true });
  }

  getById(id: number): Observable<OperationDetails> {
    return this.http.get<OperationDetails>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  create(operationDetails: OperationDetails): Observable<OperationDetails> {
    return this.http.post<OperationDetails>(this.apiUrl, operationDetails, { withCredentials: true });
  }

  update(id: number, operationDetails: OperationDetails): Observable<OperationDetails> {
    return this.http.put<OperationDetails>(`${this.apiUrl}/${id}`, operationDetails, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  search(word: string): Observable<OperationDetails[]> {
    return this.http.get<OperationDetails[]>(`${this.apiUrl}/search?word=${word}`, { withCredentials: true });
  }

// Add this method for getting transactions by customer and wallet
  getRecentTransactionsByCustomerAndWallet(cusCode: number, walIden: string, hours: number = 24): Observable<OperationDetails[]> {
    let params = new HttpParams()
      .set('cusCode', cusCode.toString())
      .set('walIden', walIden)
      .set('hours', hours.toString());

    return this.http.get<OperationDetails[]>(`${this.apiUrl}/recent-by-customer-wallet`, { withCredentials: true, params }).pipe(
      tap(response => {
        console.log('Transactions loaded:', response);
      }),
      catchError(error => {
        console.error('Error loading transactions:', error);
        return throwError(error);
      })
    );
  }

  // Add this method as fallback - get all transactions for customer
  getTransactionsByCustomer(cusCode: number): Observable<OperationDetails[]> {
    return this.http.get<OperationDetails[]>(`${this.apiUrl}/by-customer/${cusCode}`, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('Error loading customer transactions:', error);
        return throwError(error);
      })
    );
  }
  // Récupérer toutes les transactions d'un wallet par son identifiant
getTransactionsByWallet(walIden: string): Observable<OperationDetails[]> {
  return this.http.get<OperationDetails[]>(`${this.apiUrl}/by-wallet/${walIden}`, { withCredentials: true }).pipe(
    tap(response => console.log('Transactions wallet:', response)),
    catchError(error => {
      console.error('Erreur chargement transactions wallet:', error);
      return throwError(error);
    })
  );
}


}
