import {Employee} from './employee';
import {Organization} from '../configuration/organization';

export class Salary {
  id: number;
  amount: number;
  beginDate: Date;
  endDate: Date;
  isActive: boolean;
  employee: Employee;
  organization: Organization;
}
