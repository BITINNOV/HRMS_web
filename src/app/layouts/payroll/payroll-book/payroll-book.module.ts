import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PayrollBookRoutingModule} from './payroll-book-routing.module';
import {SharedModule} from '../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PayrollBookRoutingModule,
    SharedModule
  ]
})
export class PayrollBookModule {
}
