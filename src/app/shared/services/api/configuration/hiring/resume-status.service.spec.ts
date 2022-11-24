import {TestBed} from '@angular/core/testing';

import {ResumeStatusService} from './resume-status.service';

describe('ResumeStatusService', () => {
  let service: ResumeStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResumeStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
