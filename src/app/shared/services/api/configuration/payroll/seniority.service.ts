import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {ProxyService} from '../../proxy.service';
import {Seniority} from '../../../../models/configuration/payroll/seniority';

@Injectable()
export class SeniorityService extends HrService<Seniority> {

  constructor(proxy: ProxyService) {
    super(proxy, 'seniorities');
  }

}
