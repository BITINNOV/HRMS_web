import {PayrollStatement} from './payroll-statement';
import {Organization} from '../configuration/organization';

export class PayrollBook {
  id: number;
  inputDate: Date;
  payrollStatement: PayrollStatement;
  organization: Organization;
}
