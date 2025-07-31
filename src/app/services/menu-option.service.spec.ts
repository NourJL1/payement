import { TestBed } from '@angular/core/testing';

import { MenuOptionService } from './menu-option.service';

describe('MenuOptionService', () => {
  let service: MenuOptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuOptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
