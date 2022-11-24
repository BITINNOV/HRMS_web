import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {HiringCycle} from '../../../../models/configuration/hiring/hiring-cycle';
import {ProxyService} from '../../proxy.service';

@Injectable()
export class HiringCycleService extends HrService<HiringCycle> {

  constructor(proxy: ProxyService) {
    super(proxy, 'hiringycles');
  }

}
