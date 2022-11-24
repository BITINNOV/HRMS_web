import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ActionTypeComponent} from './action-type.component';

const routes: Routes = [{path: '', component: ActionTypeComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ActionTypeRoutingModule {
}
