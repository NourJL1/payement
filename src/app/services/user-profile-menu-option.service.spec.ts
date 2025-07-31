import { TestBed } from '@angular/core/testing';

import { UserProfileMenuOptionService } from './user-profile-menu-options.service';

describe('UserProfileMenuOptionService', () => {
  let service: UserProfileMenuOptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserProfileMenuOptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
