import {TestBed} from '@angular/core/testing';

import {HiringTypeService} from './hiring-type.service';

describe('HiringTypeService', () => {
  let service: HiringTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiringTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
