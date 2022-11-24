import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {TrackingCycleLineStatus} from '../../../../models/configuration/employee/tracking-cycle-line-status';
import {ProxyService} from '../../proxy.service';

@Injectable()
export class TrackingCycleLineStatusService extends HrService<TrackingCycleLineStatus> {

  constructor(proxy: ProxyService) {
    super(proxy, 'trackingcyclelinestatuses');
  }

}
