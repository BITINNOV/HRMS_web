import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {TrackingCycleStatus} from '../../../../models/configuration/employee/tracking-cycle-status';
import {ProxyService} from '../../proxy.service';

@Injectable()
export class TrackingCycleStatusService extends HrService<TrackingCycleStatus> {

  constructor(proxy: ProxyService) {
    super(proxy, 'trackingcyclestatuses');
  }

}
