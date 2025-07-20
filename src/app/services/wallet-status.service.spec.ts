import { TestBed } from '@angular/core/testing';

import { WalletStatusService } from './wallet-status.service';

describe('WalletStatusService', () => {
  let service: WalletStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
