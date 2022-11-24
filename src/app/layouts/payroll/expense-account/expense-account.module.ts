import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ExpenseAccountRoutingModule} from './expense-account-routing.module';
import {SharedModule} from '../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ExpenseAccountRoutingModule,
    SharedModule
  ]
})
export class ExpenseAccountModule {
}
