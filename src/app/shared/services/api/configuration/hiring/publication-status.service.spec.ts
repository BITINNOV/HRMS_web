import {TestBed} from '@angular/core/testing';

import {PublicationStatusService} from './publication-status.service';

describe('PublicationStatusService', () => {
  let service: PublicationStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicationStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
