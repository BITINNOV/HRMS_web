import {Injectable} from '@angular/core';
import {HrService} from '../hr.service';
import {ProxyService} from '../proxy.service';
import {Advance} from '../../../models/payroll/advance';

@Injectable()
export class AdvanceService extends HrService<Advance> {

  constructor(proxy: ProxyService) {
    super(proxy, 'advances');
  }

}
