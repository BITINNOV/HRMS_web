import {Injectable} from '@angular/core';
import {HrService} from '../hr.service';
import {ProxyService} from '../proxy.service';
import {Salary} from '../../../models/employee/salary';

@Injectable()
export class SalaryService extends HrService<Salary> {

  constructor(proxy: ProxyService) {
    super(proxy, 'salaries');
  }

}
