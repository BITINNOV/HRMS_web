import {FiscalYear} from './fiscal-year';
import {Country} from '../country';

export class Seniority {
  id: number;
  startTrache: number;
  endTranche: number;
  rate: number;
  ceiling: boolean;
  ceilingAmount: number;
  fiscalYear: FiscalYear;
  country: Country;
}
