import {TestBed} from '@angular/core/testing';

import {AbsenceTypeService} from './absence-type.service';

describe('AbsenceTypeService', () => {
  let service: AbsenceTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbsenceTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
