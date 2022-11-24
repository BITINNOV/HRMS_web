import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {EmployeeStatus} from '../../../../models/configuration/employee/employee-status';
import {ProxyService} from '../../proxy.service';

@Injectable()
export class EmployeeStatusService extends HrService<EmployeeStatus> {

  constructor(proxy: ProxyService) {
    super(proxy, 'employeestatuses');
  }

}
