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
import { UserProfileMenuOption } from '../../entities/user-profile-menu-option';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private router: Router,
    private userProfileService: UserProfilesService,
    private upmoService: UserProfileMenuOptionsService,
    private customerService: CustomerService) { }

  showNotificationList: boolean = false;

  toggleNotificationList() {
    this.showNotificationList = !this.showNotificationList;
  }

  ngOnInit(): void {

    this.loadUserProfile(parseInt(localStorage.getItem("profileCode")!))

    this.getNewCustomers()
    setInterval(() => this.getNewCustomers(), 30000); // check every 30s
  }

  isCollapsed = false;
  profile?: UserProfile
  fullname = localStorage.getItem('fullname');
  username = localStorage.getItem('username')
  modules: Module[] = []
  options: MenuOption[] = []

  get initials() {
    if (!this.fullname) return '';
    return this.fullname.split(' ').map(name => name[0]).join('');
  };

  loadUserProfile(profileCode: number) {
    this.userProfileService.getById(profileCode).subscribe({
      next: (profile: UserProfile) => {
        this.profile = profile
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

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
      },
      error: (err: any) => console.error('Error fetching new customers today:', err)
    });
  }

  editCustomerFromNotification(customer: Customer) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/admin/customers'], {
        state: { customerToEdit: customer }
      });
    });
  }

  transferOptions(module: Module) {
    this.upmoService.getByProfileAndModule(this.profile!.code!, module.code!).subscribe({
      next: (upmos: UserProfileMenuOption[]) => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/admin/' + module.accessPath], {
            state: { permits: upmos }
          });
        });
      },
      error: (err: any) => console.error(err)
    })
  }

  currentYear: number = new Date().getFullYear();

}