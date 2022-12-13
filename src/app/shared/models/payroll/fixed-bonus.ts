import {Organization} from '../configuration/organization';
import {Position} from '../configuration/employee/position';

export class FixedBonus {
  id: number;
  code: String;
  value: number;
  taxRates: number;
  bonusDate: Date;
  position: Position;
  organization: Organization;
}
