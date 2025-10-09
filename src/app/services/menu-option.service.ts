import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { MenuOption } from '../entities/menu-option';

@Injectable({
  providedIn: 'root'
})
export class MenuOptionService {
  private apiUrl = `${environment.apiUrl}/api/menu-options`;

  constructor(private http: HttpClient) { }

  create(menuOption: MenuOption) {
    return this.http.post<MenuOption>(`${this.apiUrl}`, menuOption, { withCredentials: true });
  }

  // Read
  getById(id: number) {
    return this.http.get<MenuOption>(`${this.apiUrl}/${id}`, { withCredentials: true })
  }

  getAll() {
    return this.http.get<MenuOption[]>(`${this.apiUrl}`, { withCredentials: true })
  }

  getByIdentifier(identifier: string) {
    return this.http.get<MenuOption>(`${this.apiUrl}/getByIdentifier/${identifier}`, { withCredentials: true });
  }

  getByModule(moduleCode: number) {
    return this.http.get<MenuOption[]>(`${this.apiUrl}/by-module/${moduleCode}`, { withCredentials: true })
  }

  getChildOptions(parentCode: number) {
        return this.http.get<MenuOption[]>(`${this.apiUrl}/getChildOptions/${parentCode}`, { withCredentials: true })
    }

  // Update
  update(id: number, menuOption: MenuOption) {
    return this.http.put<MenuOption>(`${this.apiUrl}/${id}`, menuOption, { withCredentials: true })
  }

  changeModule(menuOptionId: number, newModuleId: number) {
    return this.http.put<MenuOption>(`${this.apiUrl}/${menuOptionId}/change-module/${newModuleId}`, null, { withCredentials: true })
  }

  // Delete
  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
  
    search(criteria: any) {
      return this.http.get<MenuOption[]>(`${this.apiUrl}/search?word=${criteria}`, { withCredentials: true });
    }
}
