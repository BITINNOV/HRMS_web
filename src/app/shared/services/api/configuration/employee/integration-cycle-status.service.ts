import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {IntegrationCycleStatus} from '../../../../models/configuration/employee/integration-cycle-status';
import {ProxyService} from '../../proxy.service';

@Injectable()
export class IntegrationCycleStatusService extends HrService<IntegrationCycleStatus> {

  constructor(proxy: ProxyService) {
    super(proxy, 'integrationcyclestatuses');
  }

}
