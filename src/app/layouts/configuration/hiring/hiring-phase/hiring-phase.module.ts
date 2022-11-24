import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HiringPhaseRoutingModule} from './hiring-phase-routing.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HiringPhaseRoutingModule,
    SharedModule
  ]
})
export class HiringPhaseModule {
}
