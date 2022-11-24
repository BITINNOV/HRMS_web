import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExpenseAccountComponent} from './expense-account.component';

const routes: Routes = [{path: '', component: ExpenseAccountComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseAccountRoutingModule {
}
