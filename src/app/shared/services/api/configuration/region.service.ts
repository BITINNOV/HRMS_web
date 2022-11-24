import {Injectable} from '@angular/core';
import {HrService} from '../hr.service';
import {Region} from '../../../models/configuration/region';
import {ProxyService} from '../proxy.service';

@Injectable()
export class RegionService extends HrService<Region> {

  constructor(proxy: ProxyService) {
    super(proxy, 'regions');
  }

}
