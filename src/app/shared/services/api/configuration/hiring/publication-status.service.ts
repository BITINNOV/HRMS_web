import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {ProxyService} from '../../proxy.service';
import {PublicationStatus} from '../../../../models/configuration/hiring/publication-status';

@Injectable()
export class PublicationStatusService extends HrService<PublicationStatus> {

  constructor(proxy: ProxyService) {
    super(proxy, 'publicationstatuses');
  }

}
