import {Organization} from '../organization';
import {Department} from './department';

export class Service {
  id: number;
  code: String;
  department: Department;
  organization: Organization;
}
