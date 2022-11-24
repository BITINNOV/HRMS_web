import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {ProxyService} from '../../proxy.service';
import {Department} from '../../../../models/configuration/employee/department';

@Injectable()
export class DepartmentService extends HrService<Department> {

  constructor(proxy: ProxyService) {
    super(proxy, 'departments');
  }

}
