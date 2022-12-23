import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {PrimeNGConfig} from 'primeng/api';
import {Helpers} from './helpers';
import {AuthenticationService} from './shared/services/api/authentication.service';

@Component({
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent implements OnInit, AfterViewInit {
  title = 'app';

  constructor(private _router: Router,
              private config: PrimeNGConfig,
              private authenticationService: AuthenticationService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this._router.events.subscribe((route) => {
      if (route instanceof NavigationStart) {
        Helpers.setLoading(true);
        Helpers.bodyClass('fixed-navbar');
      }
      if (route instanceof NavigationEnd) {
        window.scrollTo(0, 0);
        Helpers.setLoading(false);

        // Initialize page: handlers ...
        Helpers.initPage();
      }
    });
    this.translateService.setDefaultLang('fr');
    this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));

    this.authenticationService.getCurrentOrganization();
  }


  ngAfterViewInit() {
  }

}
