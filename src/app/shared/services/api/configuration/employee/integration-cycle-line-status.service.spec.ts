import {TestBed} from '@angular/core/testing';

import {IntegrationCycleLineStatusService} from './integration-cycle-line-status.service';

describe('IntegrationCycleLineStatusService', () => {
  let service: IntegrationCycleLineStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntegrationCycleLineStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
