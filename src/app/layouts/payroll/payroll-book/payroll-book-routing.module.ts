import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PayrollBookComponent} from './payroll-book.component';

const routes: Routes = [{path: '', component: PayrollBookComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollBookRoutingModule {
}
