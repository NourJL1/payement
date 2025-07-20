import { TestBed } from '@angular/core/testing';

import { DocTypeService } from './doc-type.service';

describe('DocTypeService', () => {
  let service: DocTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
