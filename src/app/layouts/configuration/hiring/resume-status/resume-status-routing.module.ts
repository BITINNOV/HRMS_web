import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ResumeStatusComponent} from './resume-status.component';

const routes: Routes = [{path: '', component: ResumeStatusComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumeStatusRoutingModule {
}
