import {Injectable} from '@angular/core';
import {HrService} from '../hr.service';
import {ExpenseAccountStatus} from '../../../models/configuration/employee/expense-account-status';
import {ProxyService} from '../proxy.service';

@Injectable()
export class ExpenseAccountStatusService extends HrService<ExpenseAccountStatus> {

  constructor(proxy: ProxyService) {
    super(proxy, 'expenseaccountstatuses');
  }

}
