import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TrackingCycleLineStatusComponent} from './tracking-cycle-line-status.component';

const routes: Routes = [{path: '', component: TrackingCycleLineStatusComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackingCycleLineStatusRoutingModule {
}
