import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from 'primeng/api';
import {AuthenticationService} from '../../../shared/services/api/authentication.service';
import {Organization} from '../../../shared/models/configuration/organization';
import {User} from '../../../shared/models/configuration/user';
import {ViewLanguage} from '../../../shared/models/configuration/front-end/view-language';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',

})
export class AppHeaderComponent implements OnInit {
  user: User;
  organization: Organization;
  viewLanguages: Array<ViewLanguage> = [];
  selectedViewLanguage: ViewLanguage;

  constructor(private authentification: AuthenticationService,
              private messageService: MessageService,
              private translate: TranslateService) {
    this.viewLanguages = [
      {name: 'Arabe', code: 'MA'},
      {name: 'Français', code: 'FR'},
      {name: 'Espagnole', code: 'ES'},
      {name: 'Anglais', code: 'US'}
    ];
  }

  ngOnInit() {
    this.user = this.authentification.getCurrentUser();
    this.organization = this.authentification.getCurrentOrganization();

    this.translate.addLangs([
      'ar',
      'es',
      'en',
      'fr'
    ]);
    this.translate.setDefaultLang('fr');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(
      browserLang.match(/ar|es|en|fr/)
        ? browserLang
        : 'fr'
    );
  }

  loadData() {
  }

  onChange(event) {
    this.selectedViewLanguage = event.selectedViewLanguage;
    const language = this.selectedViewLanguage.code.toString();
    this.translate.use(language);
  }

  logout() {
    this.authentification.logout();
  }
}
