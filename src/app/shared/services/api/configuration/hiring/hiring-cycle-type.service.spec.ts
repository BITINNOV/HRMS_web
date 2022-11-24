import {TestBed} from '@angular/core/testing';

import {HiringCycleTypeService} from './hiring-cycle-type.service';

describe('HiringCycleTypeService', () => {
  let service: HiringCycleTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiringCycleTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
