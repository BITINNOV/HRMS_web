import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {ProxyService} from '../../proxy.service';
import {ResumeType} from '../../../../models/configuration/hiring/resume-type';

@Injectable()
export class ResumeTypeService extends HrService<ResumeType> {

  constructor(proxy: ProxyService) {
    super(proxy, 'resumetypes');
  }

}
