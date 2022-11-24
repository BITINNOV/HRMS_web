import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FiscalYearComponent} from './fiscal-year.component';

const routes: Routes = [{path: '', component: FiscalYearComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FiscalYearRoutingModule {
}
