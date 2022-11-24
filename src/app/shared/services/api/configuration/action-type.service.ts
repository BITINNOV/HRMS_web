import {Injectable} from '@angular/core';
import {HrService} from '../hr.service';
import {ActionType} from '../../../models/configuration/action-type';
import {ProxyService} from '../proxy.service';

@Injectable()
export class ActionTypeService extends HrService<ActionType> {

  constructor(proxy: ProxyService) {
    super(proxy, 'actiontypes');
  }

}
