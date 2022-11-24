import {ProxyService} from '../proxy.service';
import {Country} from '../../../models/configuration/country';
import {Injectable} from '@angular/core';
import {HrService} from '../hr.service';

@Injectable()
export class CountryService extends HrService<Country> {

  constructor(proxy: ProxyService) {
    super(proxy, 'countries');
  }

}
