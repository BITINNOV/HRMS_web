import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {ProxyService} from '../../proxy.service';
import {HiringCycleType} from '../../../../models/configuration/hiring/hiring-cycle-type';

@Injectable()
export class HiringCycleTypeService extends HrService<HiringCycleType> {

  constructor(proxy: ProxyService) {
    super(proxy, 'hiringcycletypes');
  }

}
