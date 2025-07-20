import { TestBed } from '@angular/core/testing';

import { WalletCategoryOperationTypeMapService } from './wallet-category-operation-type-map.service';

describe('WalletCategoryOperationTypeMapService', () => {
  let service: WalletCategoryOperationTypeMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletCategoryOperationTypeMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
