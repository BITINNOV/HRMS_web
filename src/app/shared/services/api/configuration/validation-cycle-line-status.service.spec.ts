import { TestBed } from '@angular/core/testing';

import { ValidationCycleLineStatusService } from './validation-cycle-line-status.service';

describe('ValidationCycleLineStatusService', () => {
  let service: ValidationCycleLineStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationCycleLineStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
