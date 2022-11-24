import {TestBed} from '@angular/core/testing';

import {DisabilityNatureService} from './disability-nature.service';

describe('DisabilityNatureService', () => {
  let service: DisabilityNatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisabilityNatureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
