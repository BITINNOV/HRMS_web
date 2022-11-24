import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {ProxyService} from '../../proxy.service';
import {SkillArea} from '../../../../models/configuration/hiring/skill-area';

@Injectable()
export class SkillAreaService extends HrService<SkillArea> {

  constructor(proxy: ProxyService) {
    super(proxy, 'skillareas');
  }

}
