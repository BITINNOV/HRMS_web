import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PublicationLineStatusComponent} from './publication-line-status.component';

const routes: Routes = [{path: '', component: PublicationLineStatusComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicationLineStatusRoutingModule {
}
