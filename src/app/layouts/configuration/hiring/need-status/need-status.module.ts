import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NeedStatusRoutingModule} from './need-status-routing.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NeedStatusRoutingModule,
    SharedModule
  ]
})
export class NeedStatusModule {
}
