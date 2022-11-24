import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {ContractType} from '../../../../models/configuration/hiring/contract-type';
import {ProxyService} from '../../proxy.service';

@Injectable()
export class ContractTypeService extends HrService<ContractType> {

  constructor(proxy: ProxyService) {
    super(proxy, 'contracttypes');
  }

}
