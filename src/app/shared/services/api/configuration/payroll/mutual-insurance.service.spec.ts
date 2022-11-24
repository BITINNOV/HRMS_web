import { TestBed } from '@angular/core/testing';

import { MutualInsuranceService } from './mutual-insurance.service';

describe('MutualInsuranceService', () => {
  let service: MutualInsuranceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MutualInsuranceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
