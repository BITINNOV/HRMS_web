import { TestBed } from '@angular/core/testing';

import { VariableBonusService } from './variable-bonus.service';

describe('VariableBonusService', () => {
  let service: VariableBonusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VariableBonusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
