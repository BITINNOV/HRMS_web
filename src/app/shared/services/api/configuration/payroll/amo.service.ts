import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {ProxyService} from '../../proxy.service';
import {Amo} from '../../../../models/configuration/payroll/amo';

@Injectable()
export class AmoService extends HrService<Amo> {

  constructor(proxy: ProxyService) {
    super(proxy, 'amos');
  }

}
