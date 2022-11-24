import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoanComponent} from './loan.component';

const routes: Routes = [{path: '', component: LoanComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanRoutingModule {
}
