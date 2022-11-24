import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {ProxyService} from '../../proxy.service';
import {EstablishmentType} from '../../../../models/configuration/hiring/establishment-type';

@Injectable()
export class EstablishmentTypeService extends HrService<EstablishmentType> {

  constructor(proxy: ProxyService) {
    super(proxy, 'establishmenttypes');
  }

}
