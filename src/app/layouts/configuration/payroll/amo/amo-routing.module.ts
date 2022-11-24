import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AmoComponent} from './amo.component';

const routes: Routes = [{path: '', component: AmoComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AmoRoutingModule {
}
