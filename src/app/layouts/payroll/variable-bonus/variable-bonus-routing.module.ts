import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {VariableBonusComponent} from './variable-bonus.component';

const routes: Routes = [{path: '', component: VariableBonusComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VariableBonusRoutingModule {
}
