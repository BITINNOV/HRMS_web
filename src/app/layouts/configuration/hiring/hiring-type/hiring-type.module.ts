import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HiringTypeRoutingModule} from './hiring-type-routing.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HiringTypeRoutingModule,
    SharedModule
  ]
})
export class HiringTypeModule {
}
