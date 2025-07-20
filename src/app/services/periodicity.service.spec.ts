import { TestBed } from '@angular/core/testing';

import { PeriodicityService } from './periodicity.service';

describe('PeriodicityService', () => {
  let service: PeriodicityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeriodicityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
