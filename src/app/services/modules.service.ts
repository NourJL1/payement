import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Module } from '../entities/module';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  private apiUrl = `${environment.apiUrl}/api/modules`;

  constructor(private http: HttpClient) { }

  // Get all modules
  getAll() {
    return this.http.get<Module[]>(`${this.apiUrl}`, { withCredentials: true })
  }

  // Get a module by its code
  getById(code: number) {
    return this.http.get<Module>(`${this.apiUrl}/${code}`, { withCredentials: true })
  }

  getByIdentifier(identifier: string) {
    return this.http.get<Module>(`${this.apiUrl}/getByIdentifier/${identifier}`, { withCredentials: true });
  }

  // Create a new module
  create(module: Module) {
    return this.http.post<Module>(`${this.apiUrl}`, module, { withCredentials: true })
  }

  // Update an existing module
  update(code: number, moduleDetails: Module) {
    return this.http.put<Module>(`${this.apiUrl}/${code}`, moduleDetails, { withCredentials: true })
  }

  // Delete a module
  delete(code: number) {
    return this.http.delete(`${this.apiUrl}/${code}`, { withCredentials: true })
  }

  search(criteria: any) {
    return this.http.get<Module[]>(`${this.apiUrl}/search?word=${criteria}`, { withCredentials: true });
  }
}
