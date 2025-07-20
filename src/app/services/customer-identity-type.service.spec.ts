import { TestBed } from '@angular/core/testing';

import { CustomerIdentityTypeService } from './customer-identity-type.service';

describe('CustomerIdentityTypeService', () => {
  let service: CustomerIdentityTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerIdentityTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
