import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ValidationCycleStatusComponent} from './validationCycleStatus.component';

const routes: Routes = [{path: '', component: ValidationCycleStatusComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidationCycleStatusRoutingModule {
}
