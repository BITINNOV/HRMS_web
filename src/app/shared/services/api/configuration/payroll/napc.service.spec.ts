import { TestBed } from '@angular/core/testing';

import { NapcService } from './napc.service';

describe('NapcService', () => {
  let service: NapcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NapcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
