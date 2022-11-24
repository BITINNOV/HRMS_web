import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {RequestStatus} from '../../../../models/configuration/employee/request-status';
import {ProxyService} from '../../proxy.service';

@Injectable()
export class RequestStatusService extends HrService<RequestStatus> {

  constructor(proxy: ProxyService) {
    super(proxy, 'requeststatuses');
  }

}
