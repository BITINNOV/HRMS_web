import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AmoRoutingModule} from './amo-routing.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AmoRoutingModule,
    SharedModule
  ]
})
export class AmoModule {
}
