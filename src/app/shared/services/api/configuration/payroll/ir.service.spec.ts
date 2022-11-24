import { TestBed } from '@angular/core/testing';

import { IrService } from './ir.service';

describe('IrService', () => {
  let service: IrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
