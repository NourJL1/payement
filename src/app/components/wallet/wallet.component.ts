import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { WalletService } from '../../services/wallet.service';
import { NotificationService } from '../../services/notification.service';
import { Subscription, interval, switchMap } from 'rxjs';
import { Wallet } from '../../entities/wallet';

@Component({
  selector: 'app-wallet',
  standalone: true,
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
  imports: [CommonModule, RouterOutlet, RouterModule],
})
export class WalletComponent implements OnInit, OnDestroy {
  wallet?: Wallet;
  loading = true;
  error: string | null = null;
  private statusCheckSubscription?: Subscription;

  showNotifications = false;
  notifications: string[] = [];
  hasUnreadNotifications = false; // 🔴 shows red dot if true
  username: string = '';

  constructor(
    private http: HttpClient,
    private walletService: WalletService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadWallet();
    this.username = localStorage.getItem('username') || 'User';

    // 🕒 Auto-refresh notifications every 30 seconds
    this.statusCheckSubscription = interval(30000)
      .pipe(switchMap(() => this.notificationService.getTransactionNotifications(this.wallet?.walCode || 0)))
      .subscribe((notifications) => {
        this.handleNewNotifications(notifications);
      });
  }

  loadWallet() {
    this.loading = true;
    this.error = null;

    const cusCode = localStorage.getItem('cusCode');
    if (!cusCode) {
      this.error = 'User not authenticated';
      this.loading = false;
      this.router.navigate(['/login']);
      return;
    }

    this.walletService.getWalletByCustomerCode(parseInt(cusCode)).subscribe({
      next: (data: any) => {
        this.wallet = data;
        this.loading = false;
        this.loadNotifications();
      },
      error: (err) => {
        console.error('Failed to load wallet', err);
        this.error = 'Failed to load wallet data';
        this.loading = false;
      },
    });
  }

  loadNotifications() {
    if (this.wallet?.walCode) {
      this.notificationService.getTransactionNotifications(this.wallet.walCode).subscribe({
        next: (notifications) => this.handleNewNotifications(notifications),
        error: (err) => {
          console.error('Failed to load notifications', err);
          this.notifications = ['Failed to load notifications'];
        },
      });
    }
  }

  handleNewNotifications(newNotifications: string[]) {
    // Compare old vs new notifications
    const oldNotifications = this.notifications;
    this.notifications = newNotifications;

    if (JSON.stringify(oldNotifications) !== JSON.stringify(newNotifications)) {
      this.hasUnreadNotifications = true; // show red dot
      this.playNotificationSound();
    }
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;

    if (this.showNotifications) {
      this.hasUnreadNotifications = false; // clear red dot
    }
  }

  playNotificationSound() {
    const audio = new Audio('assets/notification.mp3');
    audio.play().catch((err) => console.warn('Unable to play sound:', err));
  }

  navigateToNotificationPreferences() {
    this.router.navigate(['/wallet/settings'], { fragment: 'notifications' });
    this.showNotifications = false;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/home']);
  }

  ngOnDestroy() {
    if (this.statusCheckSubscription) {
      this.statusCheckSubscription.unsubscribe();
    }
  }

  today: Date = new Date();
}
