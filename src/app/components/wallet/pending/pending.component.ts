import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pending',
  imports: [],
  templateUrl: './pending.component.html',
  styleUrl: './pending.component.css'
})
export class PendingComponent {

  constructor(private router: Router){}

logout() {
  localStorage.clear()
  this.router.navigate(['/home'])
}/* 

  goHome(): void {
    this.router.navigate(['/home']);
  } */

}