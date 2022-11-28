import {Employee} from '../employee/employee';
import {Organization} from '../configuration/organization';

export class PayrollStatement {
  id: number;
  inputDate: Date;
  increaseRate: number;
  numberHoursWorked: number;
  numberBankHolidays: number;
  numberPaidLeave: number;
  employee: Employee;
  organization: Organization;
}
