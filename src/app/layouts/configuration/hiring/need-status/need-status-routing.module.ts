import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NeedStatusComponent} from './need-status.component';

const routes: Routes = [{path: '', component: NeedStatusComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NeedStatusRoutingModule {
}
