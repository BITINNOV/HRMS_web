import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HiringPhaseComponent} from './hiring-phase.component';

const routes: Routes = [{path: '', component: HiringPhaseComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HiringPhaseRoutingModule {
}
