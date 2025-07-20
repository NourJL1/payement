import {Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Router, RouterModule, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-side-nav',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit{


  constructor(private router: Router) {}

  ngOnInit(): void {}

  isCollapsed = false;
  fullname = localStorage.getItem('fullname');
  username = localStorage.getItem('username')
  role = localStorage.getItem('role')

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    if (sidebar && mainContent) {
      sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('expanded');
      (mainContent as HTMLElement).style.marginLeft = this.isCollapsed ? '80px' : '260px';
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/home']);
  }

    currentYear: number = new Date().getFullYear();


}