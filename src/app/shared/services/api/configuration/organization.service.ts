import {Injectable} from '@angular/core';
import {HrService} from '../hr.service';
import {Organization} from '../../../models/configuration/organization';
import {ProxyService} from '../proxy.service';

@Injectable()
export class OrganizationService extends HrService<Organization> {

  constructor(proxy: ProxyService) {
    super(proxy, 'organizations');
  }
}
