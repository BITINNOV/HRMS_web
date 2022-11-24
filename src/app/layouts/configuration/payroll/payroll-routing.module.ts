import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PayrollComponent} from './payroll.component';

const routes: Routes = [
  {
    path: '',
    component: PayrollComponent,
    children: [
      {path: 'fiscalyear', loadChildren: () => import('./fiscal-year/fiscal-year.module').then(m => m.FiscalYearModule)},
      {path: 'amo', loadChildren: () => import('./amo/amo.module').then(m => m.AmoModule)},
      {path: 'cnss', loadChildren: () => import('./cnss/cnss.module').then(m => m.CnssModule)},
      {path: 'ir', loadChildren: () => import('./ir/ir.module').then(m => m.IrModule)},
      {path: 'napc', loadChildren: () => import('./napc/napc.module').then(m => m.NapcModule)},
      {path: 'seniority', loadChildren: () => import('./seniority/seniority.module').then(m => m.SeniorityModule)},
      // tslint:disable-next-line:max-line-length
      {path: 'mutualinsurance', loadChildren: () => import('./mutual-insurance/mutual-insurance.module').then(m => m.MutualInsuranceModule)},
      // tslint:disable-next-line:max-line-length
      {path: 'expenseaccountstatus', loadChildren: () => import('./expense-account-status/expense-account-status.module').then(m => m.ExpenseAccountStatusModule)},
    ],
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollRoutingModule {
}
