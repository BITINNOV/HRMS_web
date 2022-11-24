import {FiscalYear} from './fiscal-year';

export class Napc {
  id: number;
  ceiling: boolean;
  ceilingAmount: number;
  requirement: string;
  fiscalYear: FiscalYear;
}
