import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { Helpers } from './helpers';

@Component({
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent implements OnInit, AfterViewInit {
  title = 'app';
  constructor(private _router: Router,
    private config: PrimeNGConfig, private translateService: TranslateService) { }

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


  }




  ngAfterViewInit() { }

}
