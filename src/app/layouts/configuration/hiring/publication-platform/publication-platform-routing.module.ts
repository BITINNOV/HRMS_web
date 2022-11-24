import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PublicationPlatformComponent} from './publication-platform.component';

const routes: Routes = [{path: '', component: PublicationPlatformComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicationPlatformRoutingModule {
}
