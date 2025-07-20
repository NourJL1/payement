import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-suspended',
  imports: [],
  templateUrl: './suspended.component.html',
  styleUrl: './suspended.component.css'
})
export class SuspendedComponent {
  constructor(private router: Router) { }
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
