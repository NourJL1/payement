import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { WalletBalanceHistory } from '../entities/wallet-balance-history';
import { WalletBalanceHistoryService } from '../services/wallet-balance-history.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationPreferences: any = null;
  private readonly RECENT_THRESHOLD_HOURS = 24; // Only show notifications from the last 24 hours
  private readonly MAX_NOTIFICATIONS = 5; // Limit to 5 notifications in the bell

  constructor(private walletBalanceHistoryService: WalletBalanceHistoryService) {}

  // Save notification preferences to local storage
  saveNotificationPreferences(preferences: any): Observable<any> {
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
    this.notificationPreferences = preferences;
    return of({ success: true });
  }

  // Retrieve notification preferences from local storage
  getNotificationPreferences(): Observable<any> {
    const preferences = localStorage.getItem('notificationPreferences');
    this.notificationPreferences = preferences
      ? JSON.parse(preferences)
      : {
          email: true,
          push: true,
          sms: false,
          allTransactions: false,
          largeTransactions: true,
          deposits: true,
          withdrawals: true,
          securityAlerts: true,
          accountUpdates: true,
          marketing: false,
        };
    return of(this.notificationPreferences);
  }

  // Generate transaction-based notifications from WalletBalanceHistory
  // Generate transaction-based notifications from WalletBalanceHistory
getTransactionNotifications(walletId: number): Observable<string[]> {
  return this.walletBalanceHistoryService.getByWalletCode(walletId).pipe(
    map((history: WalletBalanceHistory[]) => {
      console.log('Raw WalletBalanceHistory response:', JSON.stringify(history, null, 2));

      const notifications: string[] = [];

      if (!this.notificationPreferences) {
        this.getNotificationPreferences().subscribe((prefs) => {
          this.notificationPreferences = prefs;
          console.log('Notification preferences loaded:', this.notificationPreferences);
        });
      }

      // Sort by date (latest first)
      const sortedHistory = history.sort((a, b) => {
        const dateA = a.wbhLastUpdated ? new Date(a.wbhLastUpdated).getTime() : 0;
        const dateB = b.wbhLastUpdated ? new Date(b.wbhLastUpdated).getTime() : 0;
        return dateB - dateA;
      });

      const now = new Date();
      const threshold = new Date(now.getTime() - this.RECENT_THRESHOLD_HOURS * 60 * 60 * 1000);

      // 🔑 Compare consecutive entries to calculate change
      for (let i = 0; i < sortedHistory.length - 1; i++) {
        const current = sortedHistory[i];
        const previous = sortedHistory[i + 1];

        const currentBalance = current.wbhLogicBalance ?? 0;
        const previousBalance = previous.wbhLogicBalance ?? 0;
        const lastUpdated = current.wbhLastUpdated ? new Date(current.wbhLastUpdated) : new Date();

        if (lastUpdated >= threshold) {
          const diff = currentBalance - previousBalance;

          if (diff > 0) {
            notifications.push(
              `💰 You received ${diff.toFixed(2)} TND on ${lastUpdated.toLocaleString()}`
            );
          } else if (diff < 0) {
            notifications.push(
              `📤 You sent ${Math.abs(diff).toFixed(2)} TND on ${lastUpdated.toLocaleString()}`
            );
          }
        }
      }

      console.log('Generated notifications:', notifications);
      return notifications.slice(0, this.MAX_NOTIFICATIONS);
    })
  );
}


}