import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EmployeeRoutingModule} from './employee-routing.module';
import {EmployeeComponent} from './employee/employee.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [
    EmployeeComponent
  ],

  imports: [
    CommonModule,
    EmployeeRoutingModule,
    SharedModule,
  ]
})
export class EmployeeModule {
}
