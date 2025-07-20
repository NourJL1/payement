import { TestBed } from '@angular/core/testing';

import { CustomerDocService } from './customer-doc.service';

describe('CustomerDocService', () => {
  let service: CustomerDocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerDocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
