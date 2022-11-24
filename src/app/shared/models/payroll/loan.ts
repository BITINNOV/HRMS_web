import {Employee} from '../employee/employee';
import {Organization} from '../configuration/organization';

export class Loan {
  id: number;
  code: String;
  totalValue: number;
  retained: number;
  loanDate: Date;
  interestRate: number;
  employee: Employee;
  organization: Organization;
}
