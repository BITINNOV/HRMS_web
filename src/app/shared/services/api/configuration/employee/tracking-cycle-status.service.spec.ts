import {TestBed} from '@angular/core/testing';

import {TrackingCycleStatusService} from './tracking-cycle-status.service';

describe('TrackingCycleStatusService', () => {
  let service: TrackingCycleStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackingCycleStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
