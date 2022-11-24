import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HiringCycleComponent} from './hiring-cycle.component';

const routes: Routes = [{path: '', component: HiringCycleComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HiringCycleRoutingModule {
}
