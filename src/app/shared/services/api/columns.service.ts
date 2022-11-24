import {ProxyService} from './proxy.service';
import {Injectable} from '@angular/core';
import {HrService} from './hr.service';
import {Columns} from '../../models/columns';

@Injectable()
export class ColumnsService extends HrService<Columns> {

  constructor(proxy: ProxyService) {
    super(proxy, 'columns');
  }

}
