import { Injectable } from '@angular/core';
import {HrService} from '../../hr.service';
import {ProxyService} from '../../proxy.service';
import {MutualInsurance} from '../../../../models/configuration/payroll/mutual-insurance';

@Injectable()
export class MutualInsuranceService extends HrService<MutualInsurance> {

  constructor(proxy: ProxyService) {
    super(proxy, 'mutualinsurances');
  }

}
