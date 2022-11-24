import {NgPipesModule} from 'ngx-pipes';
import {SharedModule} from './shared/shared.module';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {registerLocaleData} from '@angular/common';
import {AppComponent} from './/app.component';
import {AppRoutingModule} from './/app-routing.module';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {ToastrModule} from 'ngx-toastr';
import {NgxPermissionsModule} from 'ngx-permissions';
import localeFr from '@angular/common/locales/fr';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {FullCalendarModule} from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';

//  AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  //  for development
  //  return new TranslateHttpLoader(http, '/start-angular/SB-Admin-BS4-Angular-5/master/dist/assets/i18n/', '.json');
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

registerLocaleData(localeFr, 'fr');

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    OverlayPanelModule,
    HttpClientModule,
    NgPipesModule,
    ToastModule,
    FullCalendarModule, // register FullCalendar with you app
    SharedModule.forRoot(),
    NgxPermissionsModule.forRoot({
      // permissionsIsolate: false
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    ToastrModule.forRoot({
      preventDuplicates: false,
      timeOut: 2000,
      autoDismiss: true,
      closeButton: true,
      maxOpened: 2,
      newestOnTop: true,
    }),
  ],
  bootstrap: [AppComponent],
  providers: [MessageService],

})
export class AppModule {
}
