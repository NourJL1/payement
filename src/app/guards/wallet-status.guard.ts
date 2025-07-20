import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of, tap } from 'rxjs';
import { WalletService } from '../services/wallet.service';

/* export const walletStatusGuard: CanActivateFn = (route) => {
  const walletService = inject(WalletService);
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  const requiredStatus = (route.data?.['requiredStatus'] || 'ACTIVE').toUpperCase();

  return walletService.getWalletStatus().pipe(
    tap(status => {
      console.log('Guard - Wallet status:', status?.wstLabe);
      console.log('Guard - Required status:', requiredStatus);
    }),
    map(status => {
      const currentStatus = status?.wstLabe?.trim().toUpperCase();

      if (currentStatus === requiredStatus) {
        console.log('Guard - Access granted');
        return true;
      }

      // Redirection claire selon le statut ACTUEL du wallet
      if (currentStatus === 'PENDING') {
        console.log('Guard - Redirecting to /pending');
        return router.createUrlTree(['/pending']);
      } else if (currentStatus === 'ACTIVE') {
        console.log('Guard - Redirecting to /welcome');
        return router.createUrlTree(['/welcome']);
      } else {
        console.log('Guard - Unknown status, redirecting to /login');
        return router.createUrlTree(['/login']);
      }
    }),
    catchError((error) => {
      console.error('Guard - Error fetching wallet status:', error);
      return of(router.createUrlTree(['/login']));
    })
  );
};
 */