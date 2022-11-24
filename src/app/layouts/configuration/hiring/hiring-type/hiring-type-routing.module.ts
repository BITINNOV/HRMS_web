import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HiringTypeComponent} from './hiring-type.component';

const routes: Routes = [{path: '', component: HiringTypeComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HiringTypeRoutingModule {
}
