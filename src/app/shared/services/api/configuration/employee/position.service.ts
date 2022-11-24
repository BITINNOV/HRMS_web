import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {ProxyService} from '../../proxy.service';
import {Position} from '../../../../models/configuration/employee/position';

@Injectable()
export class PositionService extends HrService<Position> {

  constructor(proxy: ProxyService) {
    super(proxy, 'positions');
  }

}
