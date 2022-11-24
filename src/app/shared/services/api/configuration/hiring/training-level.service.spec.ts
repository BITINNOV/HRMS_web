import {TestBed} from '@angular/core/testing';

import {TrainingLevelService} from './training-level.service';

describe('TrainingLevelService', () => {
  let service: TrainingLevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingLevelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
