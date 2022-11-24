import {TestBed} from '@angular/core/testing';

import {PublicationLineStatusService} from './publication-line-status.service';

describe('PublicationLineStatusService', () => {
  let service: PublicationLineStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicationLineStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
