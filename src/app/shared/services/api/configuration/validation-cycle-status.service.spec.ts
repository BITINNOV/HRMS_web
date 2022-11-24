import { TestBed } from '@angular/core/testing';

import { ValidationCycleStatusService } from './validation-cycle-status.service';

describe('ValidationCycleStatusService', () => {
  let service: ValidationCycleStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationCycleStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
