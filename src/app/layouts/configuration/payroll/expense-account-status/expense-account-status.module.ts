import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ExpenseAccountStatusRoutingModule} from './expense-account-status-routing.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ExpenseAccountStatusRoutingModule,
    SharedModule
  ]
})
export class ExpenseAccountStatusModule {
}
