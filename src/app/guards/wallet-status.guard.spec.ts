import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { walletStatusGuard } from './wallet-status.guard';

describe('walletStatusGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => walletStatusGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
