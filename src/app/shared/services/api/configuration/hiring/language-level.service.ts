import {Injectable} from '@angular/core';
import {HrService} from '../../hr.service';
import {ProxyService} from '../../proxy.service';
import {LanguageLevel} from '../../../../models/configuration/hiring/language-level';

@Injectable()
export class LanguageLevelService extends HrService<LanguageLevel> {

  constructor(proxy: ProxyService) {
    super(proxy, 'languagelevels');
  }

}
