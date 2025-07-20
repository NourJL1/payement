import { TestBed } from '@angular/core/testing';

import { CustomerDocListeService } from './customer-doc-liste.service';

describe('CustomerDocListeService', () => {
  let service: CustomerDocListeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerDocListeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
