import {TestBed} from '@angular/core/testing';

import {IntegrationCycleStatusService} from './integration-cycle-status.service';

describe('IntegrationCycleStatusService', () => {
  let service: IntegrationCycleStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntegrationCycleStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
