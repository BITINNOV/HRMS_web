import {FiscalYear} from './fiscal-year';
import {Country} from '../country';

export class Ir {
  id: number;
  startTrache: number;
  endTranche: number;
  rate: number;
  amountDeduct: number;
  ceiling: boolean;
  ceilingAmount: number;
  fiscalYear: FiscalYear;
  country: Country;
}
