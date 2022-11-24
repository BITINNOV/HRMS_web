import {Injectable} from '@angular/core';
import {HrService} from '../hr.service';
import {ProxyService} from '../proxy.service';
import {FixedBonus} from '../../../models/payroll/fixed-bonus';

@Injectable()
export class FixedBonusService extends HrService<FixedBonus> {

  constructor(proxy: ProxyService) {
    super(proxy, 'fixedbonuses');
  }

}
