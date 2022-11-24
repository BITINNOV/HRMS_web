import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {ProxyService} from '../../proxy.service';
import {PublicationLineStatus} from '../../../../models/configuration/hiring/publication-line-status';

@Injectable()
export class PublicationLineStatusService extends HrService<PublicationLineStatus> {

  constructor(proxy: ProxyService) {
    super(proxy, 'publicationlinestatuses');
  }

}
