import { TestBed } from '@angular/core/testing';

import { HiringCycleService } from './hiring-cycle.service';

describe('HiringCycleService', () => {
  let service: HiringCycleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiringCycleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
