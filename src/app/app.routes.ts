import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { WalletComponent } from './components/wallet/wallet.component';
//import { walletStatusGuard } from './guards/wallet-status.guard';
import { SideNavComponent } from './components/admin/side-nav/side-nav.component'; 
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { AccountingComponent } from './components/admin/accounting/accounting.component';
import { WalletMngComponent } from './components/admin/wallet-mng/wallet-mng.component';
import { ProductsComponent } from './components/admin/products/products.component';
import { ProfilingComponent } from './components/admin/profiling/profiling.component';
import { CustomerMngComponent } from './components/admin/customer-mng/customer-mng.component';
import { PendingComponent } from './components/wallet/pending/pending.component';
import { OverviewComponent } from './components/wallet/overview/overview.component';
import { SuspendedComponent } from './components/wallet/suspended/suspended.component';
import { Role } from './entities/role';

export const routes: Routes = [

  // Redirects
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { 
    path: 'pending', 
    component: PendingComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: ['ROLE_CUSTOMER', 'ROLE_MERCHANT'], requiredStatus: 'PENDING' }
  },
  { 
    path: 'suspended', 
    component: SuspendedComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: ['ROLE_CUSTOMER', 'ROLE_MERCHANT'], requiredStatus: 'SUSPENDED' }
  },
  {
    path: 'wallet',
    component: WalletComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: ['ROLE_CUSTOMER', 'ROLE_MERCHANT'], requiredStatus: 'ACTIVE' },
    children:
    [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent}
    ]
  },
  {
    path: 'admin', 
    component: SideNavComponent, 
    canActivate: [AuthGuard],
    data: { requiredRole: 'ROLE_ADMIN' },
    children:
    [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {path: 'dashboard', component: DashboardComponent},
      {path: 'accounting', component: AccountingComponent},
      {path: 'wallets', component: WalletMngComponent},
      {path: 'products', component: ProductsComponent},
      {path: 'profiling', component: ProfilingComponent},
      {path: 'customers', component: CustomerMngComponent},
    ]
  }
];