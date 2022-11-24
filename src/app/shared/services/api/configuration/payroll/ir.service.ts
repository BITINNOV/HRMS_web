import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {ProxyService} from '../../proxy.service';
import {Ir} from '../../../../models/configuration/payroll/ir';

@Injectable()
export class IrService extends HrService<Ir> {

  constructor(proxy: ProxyService) {
    super(proxy, 'irs');
  }

}
