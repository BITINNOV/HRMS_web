import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FixedBonusComponent} from './fixed-bonus.component';

const routes: Routes = [{path: '', component: FixedBonusComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FixedBonusRoutingModule {
}
