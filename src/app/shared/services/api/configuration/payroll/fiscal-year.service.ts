import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {ProxyService} from '../../proxy.service';
import {FiscalYear} from '../../../../models/configuration/payroll/fiscal-year';

@Injectable()
export class FiscalYearService extends HrService<FiscalYear> {

  constructor(proxy: ProxyService) {
    super(proxy, 'fiscalyears');
  }

}
