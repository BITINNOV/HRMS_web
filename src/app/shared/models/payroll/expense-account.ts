import {ExpenseAccountStatus} from '../configuration/employee/expense-account-status';
import {Employee} from '../employee/employee';
import {Organization} from '../configuration/organization';

export class ExpenseAccount {
  id: number;
  code: String;
  details: String;
  comment: String;
  employee: Employee;
  expenseAccountStatus: ExpenseAccountStatus;
  organization: Organization;
}
