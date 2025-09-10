import { TestBed } from '@angular/core/testing';

import { DisplaySettingsService } from './display-settings.service';

describe('DisplaySettingsService', () => {
  let service: DisplaySettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisplaySettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
