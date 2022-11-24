import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {ProxyService} from '../../proxy.service';
import {Napc} from '../../../../models/configuration/payroll/napc';

@Injectable()
export class NapcService extends HrService<Napc> {

  constructor(proxy: ProxyService) {
    super(proxy, 'napcs');
  }

}
