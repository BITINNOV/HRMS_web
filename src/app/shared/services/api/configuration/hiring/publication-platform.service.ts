import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {PublicationPlatform} from '../../../../models/configuration/hiring/publication-platform';
import {ProxyService} from '../../proxy.service';

@Injectable()
export class PublicationPlatformService extends HrService<PublicationPlatform> {

  constructor(proxy: ProxyService) {
    super(proxy, 'publicationplatforms');
  }

}
