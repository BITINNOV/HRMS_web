import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PayrollStatementRoutingModule} from './payroll-statement-routing.module';
import {SharedModule} from '../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PayrollStatementRoutingModule,
    SharedModule
  ]
})
export class PayrollStatementModule {
}
