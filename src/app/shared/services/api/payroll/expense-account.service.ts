import {Injectable} from '@angular/core';
import {HrService} from '../hr.service';
import {ProxyService} from '../proxy.service';
import {ExpenseAccount} from '../../../models/payroll/expense-account';

@Injectable()
export class ExpenseAccountService extends HrService<ExpenseAccount> {

  constructor(proxy: ProxyService) {
    super(proxy, 'expenseaccounts');
  }

}
