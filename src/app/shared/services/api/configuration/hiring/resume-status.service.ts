import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {ProxyService} from '../../proxy.service';
import {ResumeStatus} from '../../../../models/configuration/hiring/resume-status';

@Injectable()
export class ResumeStatusService extends HrService<ResumeStatus> {

  constructor(proxy: ProxyService) {
    super(proxy, 'resumestatuses');
  }

}
