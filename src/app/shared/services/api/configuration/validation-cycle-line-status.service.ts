import {Injectable} from '@angular/core';
import {HrService} from '../hr.service';
import {ValidationCycleLineStatus} from '../../../models/configuration/validation-cycle-line-status';
import {ProxyService} from '../proxy.service';

@Injectable()
export class ValidationCycleLineStatusService extends HrService<ValidationCycleLineStatus> {

  constructor(proxy: ProxyService) {
    super(proxy, 'validationcyclelinestatuses');
  }
}
