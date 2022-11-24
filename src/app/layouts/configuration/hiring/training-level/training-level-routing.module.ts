import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TrainingLevelComponent} from './training-level.component';

const routes: Routes = [{path: '', component: TrainingLevelComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingLevelRoutingModule {
}
