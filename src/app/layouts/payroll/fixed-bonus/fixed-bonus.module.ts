import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FixedBonusRoutingModule} from './fixed-bonus-routing.module';
import {SharedModule} from '../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FixedBonusRoutingModule,
    SharedModule,
  ]
})
export class FixedBonusModule {
}
