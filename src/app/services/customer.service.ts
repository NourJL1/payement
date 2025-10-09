import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Customer } from '../entities/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiUrl = `${environment.apiUrl}/api/customers`;
  private loggedInCustomerId: number | null = null;

  constructor(private http: HttpClient) { }

  /* private getHttpOptions() {
    //const roles: Role[] = JSON.parse(localStorage.getItem('roles') || '[]');
    const rolesString = roles.map((role) => role.name).join(',');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Roles': rolesString,
      }),
    };
  } */

  register(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}`, customer);
  }

  getTotalCustomerCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`, { withCredentials: true });
  }

  getActiveCustomerCount(statusCode: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/active/${statusCode}`, { withCredentials: true });
  }

  getCustomer(username: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${username}`, { withCredentials: true });
  }

  checkPassword(cusCode: number, password: string) {
    return this.http.post<boolean>(`${this.apiUrl}/check-password/${cusCode}`, { password }, { withCredentials: true });
  }

  getNewCustomersTodayCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/new-today`, { withCredentials: true });
  }

  getNewCustomersToday(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/new-today`, { withCredentials: true });
  }

  getGrowthRate(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/growth-rate`, { withCredentials: true });
  }

  getCustomerByEmail(email: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/email/${email}`, { withCredentials: true });
  }


  existsByEmail(email: string) {
    return this.http.get<boolean>(`${this.apiUrl}/existsByEmail/${email}`, { withCredentials: true });
  }

  existsByUsername(username: string) {
    return this.http.get<boolean>(`${this.apiUrl}/existsByUsername/${username}`, { withCredentials: true });
  }

  existsByPhone(phone: string) {
    console.log(`${this.apiUrl}/existsByCusPhoneNbr/${phone}`)
    return this.http.get<boolean>(`${this.apiUrl}/existsByCusPhoneNbr/${phone}`, { withCredentials: true });
  }

  getCustomerById(customerId: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${customerId}`, { withCredentials: true });
  }

  updateCustomer(cusCode: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${cusCode}`, customer, { withCredentials: true });
  }

  resetPassword(cusCode: number, password: string) {
    return this.http.put<string>(`${this.apiUrl}/resetPassword/${cusCode}`, password, { withCredentials: true });
  }

  deleteCustomer(cusCode: number): Observable<void> {
    return this.http.delete<any>(`${this.apiUrl}/${cusCode}`, { withCredentials: true });
  }

  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}`, { withCredentials: true });
  }

  getAllCustomersWithWallets() {
    return this.http.get<Customer[]>(`${this.apiUrl}/with-wallets`, { withCredentials: true });
  }

  getEmail(cusCode: number) {
    return this.http.get(`${this.apiUrl}/getEmail/${cusCode}`, { withCredentials: true });
  }

  search(criteria: any) {
    return this.http.get<Customer[]>(`${this.apiUrl}/search?word=${criteria}`);
  }


  getCustomerCountByCity(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/count-by-city`, { withCredentials: true });
  }
}