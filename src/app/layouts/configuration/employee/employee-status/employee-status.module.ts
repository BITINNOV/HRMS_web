import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EmployeeStatusRoutingModule} from './employee-status-routing.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EmployeeStatusRoutingModule,
    SharedModule
  ]
})
export class EmployeeStatusModule {
}
