import {TestBed} from '@angular/core/testing';

import {NeedStatusService} from './need-status.service';

describe('NeedStatusService', () => {
  let service: NeedStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NeedStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
