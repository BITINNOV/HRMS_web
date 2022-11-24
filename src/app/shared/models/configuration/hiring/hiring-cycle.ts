import {Organization} from '../organization';
import {HiringCycleType} from './hiring-cycle-type';

export class HiringCycle {
  id: number;
  code: String;
  hiringCycleType: HiringCycleType;
  organization: Organization;
}
