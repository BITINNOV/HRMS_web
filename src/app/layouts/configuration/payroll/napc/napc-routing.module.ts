import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NapcComponent} from './napc.component';

const routes: Routes = [{path: '', component: NapcComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NapcRoutingModule {
}
