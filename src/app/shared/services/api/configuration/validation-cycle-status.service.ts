import {Injectable} from '@angular/core';
import {HrService} from '../hr.service';
import {ValidationCycleStatus} from '../../../models/configuration/validation-cycle-status';
import {ProxyService} from '../proxy.service';

@Injectable()
export class ValidationCycleStatusService extends HrService<ValidationCycleStatus> {

  constructor(proxy: ProxyService) {
    super(proxy, 'validationcyclestatuses');
  }
}
