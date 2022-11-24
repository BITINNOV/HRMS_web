import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RequestStatusComponent} from './request-status.component';

const routes: Routes = [{path: '', component: RequestStatusComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestStatusRoutingModule {
}
