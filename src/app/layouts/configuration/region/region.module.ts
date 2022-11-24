import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RegionRoutingModule} from './region-routing.module';
import {SharedModule} from '../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RegionRoutingModule,
    SharedModule
  ]
})
export class RegionModule {
}
