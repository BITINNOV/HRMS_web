import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PublicationTypeComponent} from './publication-type.component';

const routes: Routes = [{path: '', component: PublicationTypeComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicationTypeRoutingModule {
}
