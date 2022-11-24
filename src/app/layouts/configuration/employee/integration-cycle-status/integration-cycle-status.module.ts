import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {IntegrationCycleStatusRoutingModule} from './integration-cycle-status-routing.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IntegrationCycleStatusRoutingModule,
    SharedModule
  ]
})
export class IntegrationCycleStatusModule {
}
