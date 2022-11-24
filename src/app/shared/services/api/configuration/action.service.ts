import {Injectable} from '@angular/core';
import {HrService} from '../hr.service';
import {Action} from '../../../models/configuration/action';
import {ProxyService} from '../proxy.service';

@Injectable()
export class ActionService extends HrService<Action> {

  constructor(proxy: ProxyService) {
    super(proxy, 'actions');
  }

}
