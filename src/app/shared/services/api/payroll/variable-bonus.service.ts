import {Injectable} from '@angular/core';
import {HrService} from '../hr.service';
import {ProxyService} from '../proxy.service';
import {VariableBonus} from '../../../models/payroll/variable-bonus';

@Injectable()
export class VariableBonusService extends HrService<VariableBonus> {

  constructor(proxy: ProxyService) {
    super(proxy, 'variablebonuses');
  }

}
