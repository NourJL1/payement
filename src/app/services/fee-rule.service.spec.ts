import { TestBed } from '@angular/core/testing';

import { FeeRuleService } from './fee-rule.service';

describe('FeeRuleService', () => {
  let service: FeeRuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeeRuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
