import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TrackingCycleStatusRoutingModule} from './tracking-cycle-status-routing.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TrackingCycleStatusRoutingModule,
    SharedModule
  ]
})
export class TrackingCycleStatusModule {
}
