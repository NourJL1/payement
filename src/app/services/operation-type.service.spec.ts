import { TestBed } from '@angular/core/testing';

import { OperationTypeService } from './operation-type.service';

describe('OperationTypeService', () => {
  let service: OperationTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperationTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
