import { TestBed } from '@angular/core/testing';

import { CustomerIdentityService } from './customer-identity.service';

describe('CustomerIdentityService', () => {
  let service: CustomerIdentityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerIdentityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
