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

  createMenuOption(menuOption: MenuOption) {
    return this.http.post<MenuOption>(`${this.apiUrl}`, menuOption);
  }

  // Read
  getMenuOptionById(id: number) {
    return this.http.get<MenuOption>(`${this.apiUrl}/${id}`)
  }

  getAllMenuOptions() {
    return this.http.get<MenuOption[]>(`${this.apiUrl}`)
  }

  getByIdentifier(identifier: string) {
    return this.http.get<MenuOption>(`${this.apiUrl}/getByIdentifier/${identifier}`);
  }

  getMenuOptionsByModule(moduleCode: number) {
    return this.http.get<MenuOption[]>(`${this.apiUrl}/by-module/${moduleCode}`)
  }

  // Update
  updateMenuOption(id: number, menuOption: MenuOption) {
    return this.http.put<MenuOption>(`${this.apiUrl}/${id}`, menuOption)
  }

  changeMenuOptionModule(menuOptionId: number, newModuleId: number) {
    return this.http.put<MenuOption>(`${this.apiUrl}/${menuOptionId}/change-module/${newModuleId}`, null)
  }

  // Delete
  deleteMenuOption(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
    search(criteria: any) {
      return this.http.get<MenuOption[]>(`${this.apiUrl}/search?word=${criteria}`);
    }
}
