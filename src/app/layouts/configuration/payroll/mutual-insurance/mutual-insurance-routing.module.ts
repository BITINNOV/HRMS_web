import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MutualInsuranceComponent} from './mutual-insurance.component';

const routes: Routes = [{path: '', component: MutualInsuranceComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MutualInsuranceRoutingModule {
}
