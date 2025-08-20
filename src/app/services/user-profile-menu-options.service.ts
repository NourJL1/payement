import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserProfileMenuOption } from '../entities/user-profile-menu-option';

@Injectable({
    providedIn: 'root'
})
export class UserProfileMenuOptionsService {
    private apiUrl = `${environment.apiUrl}/api/user-profile-menu-options`;

    constructor(private http: HttpClient) { }

    // Create
    create(profileMenuOption: UserProfileMenuOption) {
        return this.http.post<UserProfileMenuOption>(`${this.apiUrl}`, profileMenuOption)
    }

    // Read
    getById(id: number) {
        return this.http.get<UserProfileMenuOption>(`${this.apiUrl}/${id}`)
    }

    getAll() {
        return this.http.get<UserProfileMenuOption[]>(`${this.apiUrl}`)
    }

    // Update
    update(id: number, profileMenuOption: UserProfileMenuOption) {
        return this.http.put<UserProfileMenuOption>(`${this.apiUrl}/${id}`, profileMenuOption)
    }

    // Delete
    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`)
    }

    getByProfileAndModule(profileCode: number, moduleCode: number) {
        return this.http.get<UserProfileMenuOption[]>(`${this.apiUrl}/profile/${profileCode}/module/${moduleCode}`)
    }

    search(criteria: any) {
        return this.http.get<UserProfileMenuOption[]>(`${this.apiUrl}/search?word=${criteria}`);
    }
}
