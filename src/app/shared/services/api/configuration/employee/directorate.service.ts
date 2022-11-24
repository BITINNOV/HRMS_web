import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {Directorate} from '../../../../models/configuration/employee/directorate';
import {ProxyService} from '../../proxy.service';

@Injectable()
export class DirectorateService extends HrService<Directorate> {

  constructor(proxy: ProxyService) {
    super(proxy, 'directorates');
  }

}
