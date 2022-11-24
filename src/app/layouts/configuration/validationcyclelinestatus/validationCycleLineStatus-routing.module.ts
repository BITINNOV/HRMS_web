import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ValidationCycleLineStatusComponent} from './validationCycleLineStatus.component';

const routes: Routes = [{path: '', component: ValidationCycleLineStatusComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidationCycleLineStatusRoutingModule {
}
