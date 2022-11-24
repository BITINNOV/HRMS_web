import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {RequestType} from '../../../../models/configuration/employee/request-type';
import {ProxyService} from '../../proxy.service';

@Injectable()
export class RequestTypeService extends HrService<RequestType> {

  constructor(proxy: ProxyService) {
    super(proxy, 'requesttypes');
  }

}
