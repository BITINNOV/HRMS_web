import {Injectable} from '@angular/core';
import {HrService} from '../hr.service';
import {ProxyService} from '../proxy.service';
import {Employee} from '../../../models/employee/employee';

@Injectable()
export class EmployeeService extends HrService<Employee> {

  constructor(proxy: ProxyService) {
    super(proxy, 'employees');
  }

}
