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
  constructor(private http: HttpClient) {}

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
  
  // Register a new user
  register(user: LocalUser): Observable<User> {
    return this.http.post<User>(
      `${this.apiUrl}/register`,
      user,
      this.getHttpOptions()
    );
  }

  // Get user details by username
  getUser(username: string): Observable<User> {
    return this.http.get<User>(
      `${this.apiUrl}/${username}`,
      this.getHttpOptions()
    );
  }
  // Get user details by ID
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(
      `${this.apiUrl}/id/${userId}`,
      this.getHttpOptions()
    );
  }
  // Update user information
  updateUser(username: string, user: LocalUser): Observable<User> {
    return this.http.put<User>(
      `${this.apiUrl}/${username}`,
      user,
      this.getHttpOptions()
    );
  }

  // Assign roles to a user
  assignRoles(username: string, roleIds: number[]): Observable<User> {
    console.log('Assigning roles to user:', username);
    console.log('Roles:', roleIds);

    return this.http.put<User>(
      `${this.apiUrl}/${username}/assignRoles`,
      roleIds,
      this.getHttpOptions()
    );
  }

  setLoggedInUserId(userId: number): void {
    this.loggedInUserId = userId;
  }

  getLoggedInUserId(): number | null {
    return this.loggedInUserId;
  }

  clearLoggedInUserId(): void {
    this.loggedInUserId = null;
  }

  // Delete user by username
  deleteUser(username: string): Observable<void> {
    return this.http.delete<any>(
      `${this.apiUrl}/${username}`,
      this.getHttpOptions()
    );
  }

  // Get all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`);
  }

  updateWalletStatus(walletId: number, status: WalletStatus): Observable<any> {
  return this.http.patch(`http://localhost:8080/api/wallet/${walletId}/status
`, { status }, this.getHttpOptions());
}
}
export { User };

