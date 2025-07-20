import { TestBed } from '@angular/core/testing';

import { CustomerStatusService } from './customer-status.service';

describe('CustomerStatusService', () => {
  let service: CustomerStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
