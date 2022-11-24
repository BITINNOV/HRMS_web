import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {ProxyService} from '../../proxy.service';
import {TrainingLevel} from '../../../../models/configuration/hiring/training-level';

@Injectable()
export class TrainingLevelService extends HrService<TrainingLevel> {

  constructor(proxy: ProxyService) {
    super(proxy, 'traininglevels');
  }

}
