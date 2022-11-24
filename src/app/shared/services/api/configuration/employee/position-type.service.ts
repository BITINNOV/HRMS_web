import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {ProxyService} from '../../proxy.service';
import {PositionType} from '../../../../models/configuration/employee/position-type';

@Injectable()
export class PositionTypeService extends HrService<PositionType> {

  constructor(proxy: ProxyService) {
    super(proxy, 'positiontypes');
  }

}
