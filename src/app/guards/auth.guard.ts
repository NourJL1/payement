import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean {
    const authoritiesString = localStorage.getItem('authorities') || '';
    const authorities = authoritiesString.split(',').map(a => a.trim());

    const requiredRole = route.data['requiredRole'] as string;
    const requiredStatus = route.data['requiredStatus'] as string;

    //const hasRole = authorities.some(userRole => this.isRoleHierarchical(userRole, requiredRole));
    const hasRole = authorities.some(userRole => userRole === requiredRole);
    const hasStatus = localStorage.getItem('status') === requiredStatus;

    if (requiredRole && hasRole || requiredStatus && hasStatus) 
      return true;

    this.router.navigate(['/login']);
    return false;
  }

  /* private isRoleHierarchical(userRole: string, requiredRole: string): boolean {
    const roleHierarchy = ['ROLE_USER', 'ROLE_CUSTOMER'];

    const userRoleIndex = roleHierarchy.indexOf(userRole);
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

    return userRoleIndex >= requiredRoleIndex;
  } */

}
