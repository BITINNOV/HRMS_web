import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {DocumentType} from '../../../../models/configuration/employee/document-type';
import {ProxyService} from '../../proxy.service';

@Injectable()
export class DocumentTypeService extends HrService<DocumentType> {

  constructor(proxy: ProxyService) {
    super(proxy, 'documenttypes');
  }

}
