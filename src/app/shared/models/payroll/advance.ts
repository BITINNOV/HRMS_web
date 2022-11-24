import {Moment} from 'moment';
import {Employee} from '../employee/employee';
import {Organization} from '../configuration/organization';

export class Advance {
  id: number;
  code: String;
  value: number;
  advanceDate: Date;
  employee: Employee;
  organization: Organization;
}
