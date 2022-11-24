import {TestBed} from '@angular/core/testing';

import {ExpenseAccountStatusService} from './expense-account-status.service';

describe('ExpenseAccountStatusService', () => {
  let service: ExpenseAccountStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseAccountStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
