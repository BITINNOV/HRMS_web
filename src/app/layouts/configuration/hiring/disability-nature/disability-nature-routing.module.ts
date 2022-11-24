import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DisabilityNatureComponent} from './disability-nature.component';

const routes: Routes = [{path: '', component: DisabilityNatureComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisabilityNatureRoutingModule {
}
