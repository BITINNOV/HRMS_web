import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {IntegrationCycleLineStatus} from '../../../../models/configuration/employee/integration-cycle-line-status';
import {ProxyService} from '../../proxy.service';

@Injectable()
export class IntegrationCycleLineStatusService extends HrService<IntegrationCycleLineStatus> {

  constructor(proxy: ProxyService) {
    super(proxy, 'integrationcyclelinestatuses');
  }

}
