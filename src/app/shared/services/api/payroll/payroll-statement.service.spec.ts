import { TestBed } from '@angular/core/testing';

import { PayrollStatementService } from './payroll-statement.service';

describe('PayrollStatementService', () => {
  let service: PayrollStatementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayrollStatementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
