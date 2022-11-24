import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {ProxyService} from '../../proxy.service';
import {TrainingType} from '../../../../models/configuration/hiring/training-type';

@Injectable()
export class TrainingTypeService extends HrService<TrainingType> {

  constructor(proxy: ProxyService) {
    super(proxy, 'trainingtypes');
  }

}
