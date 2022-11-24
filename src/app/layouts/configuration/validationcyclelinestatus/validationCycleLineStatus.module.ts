import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ValidationCycleLineStatusRoutingModule} from './validationCycleLineStatus-routing.module';
import {SharedModule} from '../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ValidationCycleLineStatusRoutingModule,
    SharedModule
  ]
})
export class ValidationCycleLineStatusModule {
}
