import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PayrollStatementComponent} from './payroll-statement.component';

const routes: Routes = [{path: '', component: PayrollStatementComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollStatementRoutingModule {
}
