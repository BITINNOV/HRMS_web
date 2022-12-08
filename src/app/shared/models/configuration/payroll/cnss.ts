import {FiscalYear} from './fiscal-year';

export class Cnss {
  id: number;
  code: String;
  salaryRate: number;
  employerRate: number;
  ceiling: boolean;
  ceilingAmount: number;
  fiscalYear: FiscalYear;
}
