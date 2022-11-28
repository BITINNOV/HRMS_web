import {Injectable} from '@angular/core';
import {HrService} from '../hr.service';
import {ProxyService} from '../proxy.service';
import {PayrollBook} from '../../../models/payroll/payroll-book';

@Injectable()
export class PayrollBookService extends HrService<PayrollBook> {

  constructor(proxy: ProxyService) {
    super(proxy, 'payrollbooks');
  }

}
