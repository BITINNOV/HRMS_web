import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ActionComponent} from '../action/action.component';

const routes: Routes = [{path: '', component: ActionComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ActionRoutingModule {
}
