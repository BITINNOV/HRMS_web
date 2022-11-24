import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {ProxyService} from '../../proxy.service';
import {DisabilityNature} from '../../../../models/configuration/hiring/disability-nature';


@Injectable()
export class DisabilityNatureService extends HrService<DisabilityNature> {

  constructor(proxy: ProxyService) {
    super(proxy, 'disabilitynatures');
  }

}
