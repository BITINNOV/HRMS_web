import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RequestStatusRoutingModule} from './request-status-routing.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RequestStatusRoutingModule,
    SharedModule
  ]
})
export class RequestStatusModule {
}
