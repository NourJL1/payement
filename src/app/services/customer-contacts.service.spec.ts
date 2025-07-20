import { TestBed } from '@angular/core/testing';

import { CustomerContactsService } from './customer-contacts.service';

describe('CustomerContactsService', () => {
  let service: CustomerContactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerContactsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
