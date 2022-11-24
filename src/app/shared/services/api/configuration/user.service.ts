import {ProxyService} from '../proxy.service';
import {User} from '../../../models/configuration/user';
import {Injectable} from '@angular/core';
import {HrService} from '../hr.service';

@Injectable()
export class UserService extends HrService<User> {

  constructor(proxy: ProxyService) {
    super(proxy, 'users');
  }
}
