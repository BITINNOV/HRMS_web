import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {ProxyService} from '../../proxy.service';
import {NeedStatus} from '../../../../models/configuration/hiring/need-status';

@Injectable()
export class NeedStatusService extends HrService<NeedStatus> {

  constructor(proxy: ProxyService) {
    super(proxy, 'needstatuses');
  }

}
