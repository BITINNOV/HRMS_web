import { TestBed } from '@angular/core/testing';

import { PayrollBookService } from './payroll-book.service';

describe('PayrollBookService', () => {
  let service: PayrollBookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayrollBookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
