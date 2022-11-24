import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IntegrationCycleLineStatusComponent} from './integration-cycle-line-status.component';

const routes: Routes = [{path: '', component: IntegrationCycleLineStatusComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegrationCycleLineStatusRoutingModule {
}
