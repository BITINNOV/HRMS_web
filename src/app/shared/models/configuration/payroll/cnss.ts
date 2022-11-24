import {FiscalYear} from './fiscal-year';

export class Cnss {
  id: number;
  salaryRate: number;
  employerRate: number;
  ceiling: boolean;
  ceilingAmount: number;
  fiscalYear: FiscalYear;
}
