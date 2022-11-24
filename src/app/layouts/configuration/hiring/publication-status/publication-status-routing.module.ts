import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PublicationStatusComponent} from './publication-status.component';

const routes: Routes = [{path: '', component: PublicationStatusComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicationStatusRoutingModule {
}
