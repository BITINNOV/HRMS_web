import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExpenseAccountStatusComponent} from './expense-account-status.component';

const routes: Routes = [{path: '', component: ExpenseAccountStatusComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseAccountStatusRoutingModule {
}
