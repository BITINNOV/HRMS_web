import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {AbsenceType} from '../../../../models/configuration/employee/absence-type';
import {ProxyService} from '../../proxy.service';

@Injectable()
export class AbsenceTypeService extends HrService<AbsenceType> {

  constructor(proxy: ProxyService) {
    super(proxy, 'absencetypes');
  }

}
