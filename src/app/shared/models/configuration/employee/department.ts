import {Organization} from '../organization';
import {Directorate} from './directorate';

export class Department {
  id: number;
  code: String;
  directorate: Directorate;
  organization: Organization;
}
