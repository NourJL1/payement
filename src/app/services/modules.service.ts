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
  getAllModules() {
    return this.http.get<Module[]>(`${this.apiUrl}`)
  }

  // Get a module by its code
  getModuleById(code: number) {
    return this.http.get<Module>(`${this.apiUrl}/${code}`)
  }

  getByIdentifier(identifier: string) {
    return this.http.get<Module>(`${this.apiUrl}/getByIdentifier/${identifier}`);
  }

  // Create a new module
  createModule(module: Module) {
    return this.http.post<Module>(`${this.apiUrl}`, module)
  }

  // Update an existing module
  updateModule(code: number, moduleDetails: Module) {
    return this.http.put<Module>(`${this.apiUrl}/${code}`, moduleDetails)
  }

  // Delete a module
  deleteModule(code: number) {
    return this.http.delete(`${this.apiUrl}/${code}`)
  }

  search(criteria: any) {
    return this.http.get<Module[]>(`${this.apiUrl}/search?word=${criteria}`);
  }
}
