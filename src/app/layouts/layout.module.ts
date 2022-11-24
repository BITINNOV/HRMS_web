import {ConfirmationService, MessageService} from 'primeng/api';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {LayoutRoutingModule} from './layout-routing.module';
import {NgModule} from '@angular/core';
import {LayoutComponent} from './/layout.component';
import {AppHeaderComponent} from './template/app-header/app-header.component';
import {AppSidebarComponent as AppSidebarComponent} from './template/app-sidebar/app-sidebar.component';
import {AppFooter as AppFooterComponent} from './template/app-footer/app-footer.component';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {TableModule} from 'primeng/table';
import {NgxPermissionsModule} from 'ngx-permissions';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {ToastModule} from 'primeng/toast';
import {SharedModule} from '../shared/shared.module';
import {FieldsetModule} from 'primeng/fieldset';
import {ConfigurationComponent} from './configuration/configuration.component';
import {PayrollComponent} from './payroll/payroll.component';
import { EmployeeComponent } from './employee/employee.component';

@NgModule({
  declarations: [
    LayoutComponent,
    AppHeaderComponent,
    AppSidebarComponent,
    AppFooterComponent,
    ConfigurationComponent,
    PayrollComponent,
    EmployeeComponent
  ],

  imports: [
    CommonModule,
    LayoutRoutingModule,
    TranslateModule,
    SharedModule,
    NgxPermissionsModule.forChild(),
    OverlayPanelModule,
    TableModule,
    BreadcrumbModule,
    ToastModule,
    FieldsetModule
  ],

  providers: [
    ConfirmationService,
    MessageService
  ]
})
export class LayoutModule {
}
