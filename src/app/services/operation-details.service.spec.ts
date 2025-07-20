import { TestBed } from '@angular/core/testing';

import { OperationDetailsService } from './operation-details.service';

describe('OperationDetailsService', () => {
  let service: OperationDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperationDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
