import { TestBed } from '@angular/core/testing';

import { WalletBalanceHistoryService } from './wallet-balance-history.service';

describe('WalletBalanceHistoryService', () => {
  let service: WalletBalanceHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletBalanceHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
