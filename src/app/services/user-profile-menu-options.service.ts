import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserProfileMenuOption } from '../entities/user-profile-menu-option';

@Injectable({
  providedIn: 'root'
})
export class UserProfileMenuOptionsService {
  private apiUrl = `${environment.apiUrl}/api/user-profile-menu-options`;

  constructor(private http: HttpClient) {}

  // Create
    createProfileMenuOption(profileMenuOption: UserProfileMenuOption) {
        return this.http.post<UserProfileMenuOption>(`${this.apiUrl}`, profileMenuOption)
    }

    // Read
    getProfileMenuOptionById(id: number) {
        return this.http.get<UserProfileMenuOption>(`${this.apiUrl}/${id}`)
    }

    getAllProfileMenuOptions() {
        return this.http.get<UserProfileMenuOption[]>(`${this.apiUrl}`)
    }

    // Update
    updateProfileMenuOption(id: number, profileMenuOption: UserProfileMenuOption) {
        return this.http.put<UserProfileMenuOption>(`${this.apiUrl}/${id}`, profileMenuOption)
    }

    // Set or Update Profile-MenuOption relationship
    setProfileMenuOption(profileMenuOption: UserProfileMenuOption) {
        return this.http.put<UserProfileMenuOption>(`${this.apiUrl}/set`, profileMenuOption)
    }

    // Delete
    deleteProfileMenuOption(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`)
    }

    // Permission Checks
    hasAccessPermission(profileId: number, menuOptionId: number) {
        return this.http.get<boolean>(`${this.apiUrl}/check-access/${profileId}/${menuOptionId}`)
    }

    // Add similar endpoints for other permission checks...
    hasInsertPermission(profileId: number, menuOptionId: number) {
        return this.http.get(`${this.apiUrl}/check-insert/${profileId}/${menuOptionId}`)
    }
    
      search(criteria: any) {
        return this.http.get<UserProfileMenuOption[]>(`${this.apiUrl}/search?word=${criteria}`);
      }
}
