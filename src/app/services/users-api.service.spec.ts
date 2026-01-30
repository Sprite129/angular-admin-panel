import { TestBed } from '@angular/core/testing';

import { UsersAPI } from './users-api.service';

describe('UsersAPI', () => {
  let service: UsersAPI;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersAPI);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
