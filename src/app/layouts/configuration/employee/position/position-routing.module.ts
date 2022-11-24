import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PositionComponent} from './position.component';

const routes: Routes = [{path: '', component: PositionComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PositionRoutingModule {
}
