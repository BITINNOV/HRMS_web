import {Organization} from '../configuration/organization';

export class FixedBonus {
  id: number;
  code: String;
  value: number;
  taxRates: number;
  bonusDate: Date;
  organization: Organization;
}
