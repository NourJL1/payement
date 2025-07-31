import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserProfile } from '../entities/user-profile';

@Injectable({
  providedIn: 'root'
})
export class UserProfilesService {
  private apiUrl = `${environment.apiUrl}/api/user-profiles`;

  constructor(private http: HttpClient) { }

  // Create
  createUserProfile(userProfile: UserProfile) {
    return this.http.post<UserProfile>(`${this.apiUrl}`, userProfile)
  }

  // Read
  getUserProfileById(id: number) {
    return this.http.get<UserProfile>(`${this.apiUrl}/${id}`)
  }

  getAllUserProfiles() {
    return this.http.get<UserProfile[]>(`${this.apiUrl}`)
  }

  // Update
  updateUserProfile(id: number, userProfile: UserProfile) {
    return this.http.put<UserProfile>(`${this.apiUrl}/${id}`, userProfile)
  }

  // Delete
  deleteUserProfile(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`)
  }

  // Permission checks
  canViewCustomerMerchant(id: number) {
    return this.http.get<boolean>(`${this.apiUrl}/${id}/can-view-merchant`)
  }

  canDecryptPan(id: number) {
    return this.http.get<boolean>(`${this.apiUrl}/${id}/can-decrypt-pan`)
  }

  // Module management
  addModuleToProfile(profileId: number, moduleId: number) {
    return this.http.post<UserProfile>(`${this.apiUrl}/${profileId}/modules/${moduleId}`, null)
  }

  removeModuleFromProfile(profileId: number, moduleId: number) {
    return this.http.delete(`${this.apiUrl}/${profileId}/modules/${moduleId}`)
  }

  // Additional endpoints
  getProfilesWithModuleAccess(moduleCode: number) {
    return this.http.get<UserProfile[]>(`${this.apiUrl}/with-module/${moduleCode}`)
  }
  
    search(criteria: any) {
      return this.http.get<UserProfile[]>(`${this.apiUrl}/search?word=${criteria}`);
    }
}
