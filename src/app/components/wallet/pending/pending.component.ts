import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-pending',
  imports: [],
  templateUrl: './pending.component.html',
  styleUrl: './pending.component.css'
})
export class PendingComponent {

  constructor(private router: Router,
    private authService: AuthService){}

logout() {
  localStorage.clear()
  this.router.navigate(['/home'])
  this.authService.logout().subscribe();
}/* 

  goHome(): void {
    this.router.navigate(['/home']);
  } */

}