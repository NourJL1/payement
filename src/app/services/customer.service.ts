import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Role } from '../entities/role';
import { Customer } from '../entities/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiUrl = `${environment.apiUrl}/api/customers`;
  private loggedInCustomerId: number | null = null;

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    const roles: Role[] = JSON.parse(localStorage.getItem('roles') || '[]');
    const rolesString = roles.map((role) => role.name).join(',');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Roles': rolesString,
      }),
    };
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
  }

  register(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}`, customer);
  }

  getTotalCustomerCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  getActiveCustomerCount(statusCode: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/active/${statusCode}`);
  }

  getCustomer(username: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${username}`);
  }

  getNewCustomersToday(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/new-today`);
  }

  getGrowthRate(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/growth-rate`);
  }

  getCustomerByEmail(email: string): Observable<Customer> {
    return this.http.get<Customer>(
      `${this.apiUrl}/email/${email}`/* ,
      this.getHttpOptions() */
    );
  }

  
  existsByEmail(email: string){
    return this.http.get<boolean>(`${this.apiUrl}/existsByEmail/${email}`)
  }

  existsByUsername(username: string) {
    return this.http.get<boolean>(`${this.apiUrl}/existsByUsername/${username}`);
  }

  existsByPhone(phone: string) {
    console.log(`${this.apiUrl}/existsByCusPhoneNbr/${phone}`)
    return this.http.get<boolean>(`${this.apiUrl}/existsByCusPhoneNbr/${phone}`);
  }

  getCustomerById(customerId: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${customerId}`);
  }

  updateCustomer(cusCode: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${cusCode}`, customer);
  }

  resetPassword(cusCode: number, password: string) {
    return this.http.put<string>(`${this.apiUrl}/resetPassword/${cusCode}`, password);
  }

  assignRoles(username: string, roleIds: number[]): Observable<Customer> {
    console.log('Assigning roles to customer:', username);
    console.log('Roles:', roleIds);
    return this.http.put<Customer>(
      `${this.apiUrl}/${username}/assignRoles`,
      roleIds,
      this.getHttpOptions()
    );
  }

  deleteCustomer(cusCode: number): Observable<void> {
    return this.http.delete<any>(`${this.apiUrl}/${cusCode}`);
  }

  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}`);
  }

  getAllCustomersWithWallets() {
    return this.http.get<Customer[]>(`${this.apiUrl}/with-wallets`);
  }

  sendEmail(email: string, subject: string) {
    return this.http.post<string>(`${this.apiUrl}/sendEmail`, {
      cusMailAdress: email,
      subject: subject,
    });
  }

  verifyOTP(email: string, code: string) {
    return this.http.post<boolean>(`${this.apiUrl}/compareTOTP`, {
      cusMailAdress: email,
      code: code,
    });
  }

  search(criteria: any) {
    return this.http.get<Customer[]>(`${this.apiUrl}/search?word=${criteria}`);
  }


getCustomerCountByCity(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/count-by-city`);
  }
}
export { Customer };