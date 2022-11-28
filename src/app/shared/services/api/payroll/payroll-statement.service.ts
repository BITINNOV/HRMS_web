import {Injectable} from '@angular/core';
import {HrService} from '../hr.service';
import {ProxyService} from '../proxy.service';
import {PayrollStatement} from '../../../models/payroll/payroll-statement';

@Injectable()
export class PayrollStatementService extends HrService<PayrollStatement> {

  constructor(proxy: ProxyService) {
    super(proxy, 'payrollstatements');
  }

}
