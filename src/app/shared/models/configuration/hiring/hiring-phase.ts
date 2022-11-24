import {Organization} from '../organization';

export class HiringPhase {
  id: number;
  code: String;
  priority: number;
  manager: String;
  // validationCycle: ValidationCycle;
  organization: Organization;
}
