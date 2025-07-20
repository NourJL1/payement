import { TestBed } from '@angular/core/testing';

import { WalletTypeService } from './wallet-type.service';

describe('WalletTypeService', () => {
  let service: WalletTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
