import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EstablishmentTypeComponent} from './establishment-type.component';

const routes: Routes = [{path: '', component: EstablishmentTypeComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstablishmentTypeRoutingModule {
}
