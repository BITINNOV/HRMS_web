import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AbsenceTypeComponent} from './absence-type.component';

const routes: Routes = [{path: '', component: AbsenceTypeComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AbsenceTypeRoutingModule {
}
