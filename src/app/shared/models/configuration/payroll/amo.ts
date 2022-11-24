import {FiscalYear} from './fiscal-year';

export class Amo {
  id: number;
  salaryRate: number;
  employerRate: number;
  ceiling: boolean;
  ceilingAmount: number;
  fiscalYear: FiscalYear;
}
