import { TestBed } from '@angular/core/testing';

import { PositionTypeService } from './position-type.service';

describe('PositionTypeService', () => {
  let service: PositionTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PositionTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
