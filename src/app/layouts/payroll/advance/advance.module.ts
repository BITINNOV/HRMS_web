import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AdvanceRoutingModule} from './advance-routing.module';
import {SharedModule} from '../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdvanceRoutingModule,
    SharedModule
  ]
})
export class AdvanceModule {
}
