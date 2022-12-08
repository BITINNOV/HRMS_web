import {FiscalYear} from './fiscal-year';

export class Amo {
  id: number;
  code: String;
  salaryRate: number;
  employerRate: number;
  ceiling: boolean;
  ceilingAmount: number;
  fiscalYear: FiscalYear;
}
