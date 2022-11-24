import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from 'primeng/api';
import {AuthenticationService} from '../../../shared/services/api/authentication.service';
import {Organization} from '../../../shared/models/configuration/organization';
import {User} from '../../../shared/models/configuration/user';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',

})
export class AppHeaderComponent implements OnInit {

  user: User;
  organization: Organization;
  notificationSize: number;
  notificationReceptionSize: number;
  notificationExpeditionSize: number;
  notificationProductionSize: number;

  constructor(private authentification: AuthenticationService,
              private messageService: MessageService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.user = this.authentification.getCurrentUser();
    this.organization = this.authentification.getCurrentOrganization();

    this.translate.addLangs([
      'en',
      'fr'
    ]);
    this.translate.setDefaultLang('fr');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(
      browserLang.match(/en|fr/)
        ? browserLang
        : 'fr'
    );
  }

  loadData() {
  }


  changeLang(language: string) {
    // console.log(language);
    this.translate.use(language);
  }

  logout() {
    this.authentification.logout();
  }
}
