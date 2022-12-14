import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PayrollComponent} from './payroll.component';

const routes: Routes = [
  {
    path: '',
    component: PayrollComponent,
    children: [
      {path: 'loan', loadChildren: () => import('./loan/loan.module').then(m => m.LoanModule)},
      {path: 'advance', loadChildren: () => import('./advance/advance.module').then(m => m.AdvanceModule)},
      {path: 'fixedbonus', loadChildren: () => import('./fixed-bonus/fixed-bonus.module').then(m => m.FixedBonusModule)},
      {path: 'variablebonus', loadChildren: () => import('./variable-bonus/variable-bonus.module').then(m => m.VariableBonusModule)},
      {path: 'expenseaccount', loadChildren: () => import('./expense-account/expense-account.module').then(m => m.ExpenseAccountModule)},
      // tslint:disable-next-line:max-line-length
      {path: 'payrollstatement', loadChildren: () => import('./payroll-statement/payroll-statement.module').then(m => m.PayrollStatementModule)},
      {path: 'payrollbook', loadChildren: () => import('./payroll-book/payroll-book.module').then(m => m.PayrollBookModule)},
    ],
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollRoutingModule {
}
