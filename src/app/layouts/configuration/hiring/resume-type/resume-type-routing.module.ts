import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ResumeTypeComponent} from './resume-type.component';

const routes: Routes = [{path: '', component: ResumeTypeComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumeTypeRoutingModule {
}
