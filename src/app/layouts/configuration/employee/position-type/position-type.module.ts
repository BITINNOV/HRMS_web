import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PositionTypeRoutingModule} from './position-type-routing.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PositionTypeRoutingModule,
    SharedModule
  ]
})
export class PositionTypeModule {
}
