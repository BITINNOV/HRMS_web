import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {ProxyService} from '../../proxy.service';
import {PublicationType} from '../../../../models/configuration/hiring/publication-type';

@Injectable()
export class PublicationTypeService extends HrService<PublicationType> {

  constructor(proxy: ProxyService) {
    super(proxy, 'publicationtypes');
  }

}
