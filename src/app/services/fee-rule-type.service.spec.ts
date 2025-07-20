import { TestBed } from '@angular/core/testing';

import { FeeRuleTypeService } from './fee-rule-type.service';

describe('FeeRuleTypeService', () => {
  let service: FeeRuleTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeeRuleTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
