import {Employee} from '../employee/employee';
import {Organization} from '../configuration/organization';

export class VariableBonus {
  id: number;
  code: String;
  value: number;
  taxRates: number;
  variableBonusDate: Date;
  employee: Employee;
  organization: Organization;
}
