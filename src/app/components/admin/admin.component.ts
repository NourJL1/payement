import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from "@angular/router";
import { CommonModule } from '@angular/common';
import { Customer, CustomerService } from '../../services/customer.service';
import { UserService } from '../../services/user.service';
import { MenuOption } from '../../entities/menu-option';
import { AuthService } from '../../services/auth.service';
import { UserProfilesService } from '../../services/user-profiles.service';
import { ModuleService } from '../../services/modules.service';
import { MenuOptionService } from '../../services/menu-option.service';
import { UserProfileMenuOptionsService } from '../../services/user-profile-menu-options.service';
import { Module } from '../../entities/module';
import { UserProfile } from '../../entities/user-profile';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private router: Router,
    private userService: UserService,
    private userProfileService: UserProfilesService,
    private moduleService: ModuleService,
    private menuOptionService: MenuOptionService,
    private upmoService: UserProfileMenuOptionsService,
    private authService: AuthService,
    private customerService: CustomerService) { }

  showNotificationList: boolean = false;

  toggleNotificationList() {
    this.showNotificationList = !this.showNotificationList;
  }

  ngOnInit(): void {

    this.loadModules()
    //this.loadUserProfileModules(this.authorities)
    //this.loadUserProfileMenuOptions(authorities)

    this.getNewCustomers()
    setInterval(() => this.getNewCustomers(), 30000); // check every 30s
  }

  isCollapsed = false;
  authorities: string[] = localStorage.getItem('authorities')!.split(',').map(a => a.trim())
  fullname = localStorage.getItem('fullname');
  username = localStorage.getItem('username')
  modules: Module[] = []
  options: MenuOption[] = []

  loadModules() {
    this.moduleService.getAll().subscribe({
      next: (modules: Module[]) => {
        this.modules = modules
      },
      error: (err) => { console.log(err) }
    })
  }

  /* loadUserProfileModules(authorities: string[]) {
    this.userProfileService.getByIdentifier(authorities[1]).subscribe({
          next: (profile: UserProfile) => {
            this.modules = profile.modules!;
            console.log(profile)
            console.log(profile.modules)
          },
          error: (error) => {
            console.log(error);
          }
        })
  }

  async loadUserProfileMenuOptions(authorities: string[]) {
    authorities.forEach(authority => {
      if (authority.startsWith("MOP"))
        this.menuOptionService.getByIdentifier(authority).subscribe({
          next: (option: MenuOption) => {
            this.options.push(option)
          },
          error: (error) => {
            console.log(error)
          }
        })
    });
  } */

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