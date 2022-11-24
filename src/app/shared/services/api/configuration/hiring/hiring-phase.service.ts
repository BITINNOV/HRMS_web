import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {HiringPhase} from '../../../../models/configuration/hiring/hiring-phase';
import {ProxyService} from '../../proxy.service';

@Injectable()
export class HiringPhaseService extends HrService<HiringPhase> {

  constructor(proxy: ProxyService) {
    super(proxy, 'hiringphases');
  }

}
