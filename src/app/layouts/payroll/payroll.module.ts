import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PayrollRoutingModule} from './payroll-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {LoanComponent} from './loan/loan.component';
import {AdvanceComponent} from './advance/advance.component';
import {VariableBonusComponent} from './variable-bonus/variable-bonus.component';
import {FixedBonusComponent} from './fixed-bonus/fixed-bonus.component';
import {ExpenseAccountComponent} from './expense-account/expense-account.component';
import {PayrollStatementComponent} from './payroll-statement/payroll-statement.component';
import {PayrollBookComponent} from './payroll-book/payroll-book.component';


@NgModule({
  declarations: [
    LoanComponent,
    AdvanceComponent,
    VariableBonusComponent,
    FixedBonusComponent,
    ExpenseAccountComponent,
    PayrollStatementComponent,
    PayrollBookComponent,
  ],

  imports: [
    CommonModule,
    PayrollRoutingModule,
    SharedModule,
  ]
})
export class PayrollModule {
}
