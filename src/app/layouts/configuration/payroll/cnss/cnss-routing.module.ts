import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CnssComponent} from './cnss.component';

const routes: Routes = [{path: '', component: CnssComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CnssRoutingModule {
}
