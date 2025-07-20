import { TestBed } from '@angular/core/testing';

import { AccountListService } from './account-list.service';

describe('AccountListService', () => {
  let service: AccountListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
