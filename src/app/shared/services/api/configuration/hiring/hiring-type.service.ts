import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {ProxyService} from '../../proxy.service';
import {HiringType} from '../../../../models/configuration/hiring/hiring-type';

@Injectable()
export class HiringTypeService extends HrService<HiringType> {

  constructor(proxy: ProxyService) {
    super(proxy, 'hiringtypes');
  }

}
