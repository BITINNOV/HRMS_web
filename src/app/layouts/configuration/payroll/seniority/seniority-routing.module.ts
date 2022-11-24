import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SeniorityComponent} from './seniority.component';

const routes: Routes = [{path: '', component: SeniorityComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeniorityRoutingModule {
}
