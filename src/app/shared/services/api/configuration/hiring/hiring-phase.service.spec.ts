import { TestBed } from '@angular/core/testing';

import { HiringPhaseService } from './hiring-phase.service';

describe('HiringPhaseService', () => {
  let service: HiringPhaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiringPhaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
