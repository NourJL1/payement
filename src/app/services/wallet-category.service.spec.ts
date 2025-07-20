import { TestBed } from '@angular/core/testing';

import { WalletCategoryService } from './wallet-category.service';

describe('WalletCategoryService', () => {
  let service: WalletCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
