import {Injectable} from '@angular/core';
import {HrService} from '../hr.service';
import {ProxyService} from '../proxy.service';
import {Loan} from '../../../models/payroll/loan';

@Injectable()
export class LoanService extends HrService<Loan> {

  constructor(proxy: ProxyService) {
    super(proxy, 'loans');
  }

}
