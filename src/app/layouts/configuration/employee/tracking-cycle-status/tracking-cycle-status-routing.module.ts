import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TrackingCycleStatusComponent} from './tracking-cycle-status.component';

const routes: Routes = [{path: '', component: TrackingCycleStatusComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackingCycleStatusRoutingModule {
}
