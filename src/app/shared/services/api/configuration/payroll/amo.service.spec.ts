import { TestBed } from '@angular/core/testing';

import { AmoService } from './amo.service';

describe('AmoService', () => {
  let service: AmoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
