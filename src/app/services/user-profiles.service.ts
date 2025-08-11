import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserProfile } from '../entities/user-profile';
import Module from 'node:module';

@Injectable({
  providedIn: 'root'
})
export class UserProfilesService {
  private apiUrl = `${environment.apiUrl}/api/user-profiles`;

  constructor(private http: HttpClient) { }

  // Create
  create(userProfile: UserProfile) {
    return this.http.post<UserProfile>(`${this.apiUrl}`, userProfile)
  }

  // Read
  getById(id: number) {
    return this.http.get<UserProfile>(`${this.apiUrl}/${id}`)
  }

  getAll() {
    return this.http.get<UserProfile[]>(`${this.apiUrl}`)
  }

  getByIdentifier(identifier: string) {
    return this.http.get<UserProfile>(`${this.apiUrl}/getByIdentifier/${identifier}`);
  }

  // Update
  update(id: number, userProfile: UserProfile) {
    return this.http.put<UserProfile>(`${this.apiUrl}/${id}`, userProfile)
  }

  // Delete
  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`)
  }

  // Permission checks
  canViewCustomerMerchant(id: number) {
    return this.http.get<boolean>(`${this.apiUrl}/${id}/can-view-merchant`)
  }

  canDecryptPan(id: number) {
    return this.http.get<boolean>(`${this.apiUrl}/${id}/can-decrypt-pan`)
  }

  // Additional endpoints
  getProfilesWithModuleAccess(moduleCode: number) {
    return this.http.get<UserProfile[]>(`${this.apiUrl}/with-module/${moduleCode}`)
  }

  getProfileModules(code: number) {
    return this.http.get<Module[]>(`${this.apiUrl}/get-modules/${code}`);
  }

  search(criteria: any) {
    console.log(`${this.apiUrl}/search?word=${criteria}`);
    return this.http.get<UserProfile[]>(`${this.apiUrl}/search?word=${criteria}`);
  }
}
