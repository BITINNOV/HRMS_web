import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ConfigurationRoutingModule} from './configuration-routing.module';
import {UserComponent} from './user/user.component';
import {CountryComponent} from './country/country.component';
import {OrganizationComponent} from './organization/organization.component';
import {ValidationCycleStatusComponent} from './validationcyclestatus/validationCycleStatus.component';
import {ValidationCycleLineStatusComponent} from './validationcyclelinestatus/validationCycleLineStatus.component';
import {ConfigurationComponent} from './configuration.component';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {EmployeeComponent} from './employee/employee.component';
import {HiringComponent} from './hiring/hiring.component';
import {ActionComponent} from './action/action.component';
import {ActionTypeComponent} from './action-type/action-type.component';
import {RegionComponent} from './region/region.component';
import {PayrollComponent} from './payroll/payroll.component';


@NgModule({
  declarations: [
    ConfigurationComponent,
    EmployeeComponent,
    HiringComponent,
    UserComponent,
    CountryComponent,
    OrganizationComponent,
    ValidationCycleStatusComponent,
    ValidationCycleLineStatusComponent,
    ActionComponent,
    ActionTypeComponent,
    RegionComponent,
    PayrollComponent,
  ],
  imports: [
    ConfigurationRoutingModule,
    CommonModule,
    SharedModule,
    FormsModule
  ]
})
export class ConfigurationModule {
}
