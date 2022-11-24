import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {ProxyService} from '../../proxy.service';
import {DocumentTerms} from '../../../../models/configuration/employee/document-terms';

@Injectable()
export class DocumentTermsService extends HrService<DocumentTerms> {

  constructor(proxy: ProxyService) {
    super(proxy, 'documentterms');
  }

}
