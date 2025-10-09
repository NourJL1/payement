import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-suspended',
  imports: [],
  templateUrl: './suspended.component.html',
  styleUrl: './suspended.component.css'
})
export class SuspendedComponent {
  constructor(private router: Router,
      private authService: AuthService) { }
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
    this.authService.logout().subscribe();
  }

}
