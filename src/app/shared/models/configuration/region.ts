import {Organization} from './organization';
import {Country} from './country';

export class Region {
  id: number;
  code: String;
  country: Country;
  organization: Organization;
}
