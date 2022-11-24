import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IntegrationCycleStatusComponent} from './integration-cycle-status.component';

const routes: Routes = [{path: '', component: IntegrationCycleStatusComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegrationCycleStatusRoutingModule {
}
