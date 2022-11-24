import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {ProxyService} from '../../proxy.service';
import {Service} from '../../../../models/configuration/employee/service';

@Injectable()
export class ServiceService extends HrService<Service> {

  constructor(proxy: ProxyService) {
    super(proxy, 'services');
  }

}
