import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Role } from '../entities/role';
import { WalletStatus } from '../entities/wallet-status';
import { User } from '../entities/user';
export interface LocalUser {
  id?: number;
  username: string;
  password: string;
  fullname: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/users`;
  private loggedInUserId: number | null = null;
  constructor(private http: HttpClient) { }

  private getHttpOptions() {
    const roles: Role[] = JSON.parse(localStorage.getItem('roles') || '[]');
    const rolesString = roles.map((role) => role.name).join(',');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Roles': rolesString // Changed from 'Roles' to 'X-Roles'
      }),
    };
  }
  // Add this method to fetch total user count
  getTotalUserCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  getAll() {
    return this.http.get<User[]>(`${this.apiUrl}`)
  }

  getById(code: number) {
    return this.http.get<User>(`${this.apiUrl}/${code}`)
  }

  create(user: User) {
    return this.http.post<User>(`${this.apiUrl}`, user)
  }

  update(code: number, user: User) {
    return this.http.put<User>(`${this.apiUrl}/${code}`, user)
  }

  delete(code: number) {
    return this.http.delete(`${this.apiUrl}/${code}`)
  }
  
    search(criteria: any) {
      return this.http.get<User[]>(`${this.apiUrl}/search?word=${criteria}`);
    }
}

