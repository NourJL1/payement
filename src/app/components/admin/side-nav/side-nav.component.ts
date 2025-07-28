import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from "@angular/router";
import { Customer } from '../../../entities/customer';
import { CustomerService } from '../../../services/customer.service';
import { CommonModule } from '@angular/common';
import { CustomerMngComponent } from '../customer-mng/customer-mng.component';

@Component({
  selector: 'app-side-nav',
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  constructor(private router: Router, private customerService: CustomerService) { }

  showNotificationList: boolean = false;

  toggleNotificationList() {
    this.showNotificationList = !this.showNotificationList;
  }

  ngOnInit(): void {
    this.getNewCustomers()
    setInterval(() => this.getNewCustomers(), 60000); // check every 1 min
  }

  isCollapsed = false;
  fullname = localStorage.getItem('fullname');
  username = localStorage.getItem('username')
  //authorities: string[] = localStorage.getItem('authorities')

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

  newCustomers: Customer[] = []

  getNewCustomers() {
    this.customerService.getNewCustomersToday().subscribe({
      next: (customers: Customer[]) => {
        this.newCustomers = customers;
        // Placeholder for percentage change from yesterday
      },
      error: (err: any) => console.error('Error fetching new customers today:', err),
    });
  }

  editCustomerFromNotification(customer: Customer) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/admin/customers'], {
        state: { customerToEdit: customer }
      });
    });
  }

  currentYear: number = new Date().getFullYear();


}