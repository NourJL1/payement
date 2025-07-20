import { TestBed } from '@angular/core/testing';

import { WalletOperationsService } from './wallet-operations.service';

describe('WalletOperationsService', () => {
  let service: WalletOperationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletOperationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
