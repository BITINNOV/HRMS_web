import {TestBed} from '@angular/core/testing';

import {TrackingCycleLineStatusService} from './tracking-cycle-line-status.service';

describe('TrackingCycleLineStatusService', () => {
  let service: TrackingCycleLineStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackingCycleLineStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
