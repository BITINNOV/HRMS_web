import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ValidationCycleStatusRoutingModule} from './validationCycleStatus-routing.module';
import {SharedModule} from '../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ValidationCycleStatusRoutingModule,
    SharedModule
  ]
})
export class ValidationCycleStatusModule {
}
