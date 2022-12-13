import {FiscalYear} from './fiscal-year';
import {Country} from '../country';

export class Cnss {
  id: number;
  code: String;
  salaryRate: number;
  employerRate: number;
  ceiling: boolean;
  ceilingAmount: number;
  fiscalYear: FiscalYear;
  country: Country;
}
