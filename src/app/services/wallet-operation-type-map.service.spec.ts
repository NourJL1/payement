import { TestBed } from '@angular/core/testing';

import { WalletOperationTypeMapService } from './wallet-operation-type-map.service';

describe('WalletOperationTypeMapService', () => {
  let service: WalletOperationTypeMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletOperationTypeMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
