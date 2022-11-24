import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {ProxyService} from '../../proxy.service';
import {Cnss} from '../../../../models/configuration/payroll/cnss';

@Injectable()
export class CnssService extends HrService<Cnss> {

  constructor(proxy: ProxyService) {
    super(proxy, 'cnsss');
  }

}
