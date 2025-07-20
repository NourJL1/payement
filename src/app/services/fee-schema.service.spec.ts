import { TestBed } from '@angular/core/testing';

import { FeeSchemaService } from './fee-schema.service';

describe('FeeSchemaService', () => {
  let service: FeeSchemaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeeSchemaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
