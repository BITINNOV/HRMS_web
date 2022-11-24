import { TestBed } from '@angular/core/testing';

import { FixedBonusService } from './fixed-bonus.service';

describe('FixedBonusService', () => {
  let service: FixedBonusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FixedBonusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
