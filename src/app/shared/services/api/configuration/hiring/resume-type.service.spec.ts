import {TestBed} from '@angular/core/testing';

import {ResumeTypeService} from './resume-type.service';

describe('ResumeTypeService', () => {
  let service: ResumeTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResumeTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
