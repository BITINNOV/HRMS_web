import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RequestTypeRoutingModule} from './request-type-routing.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RequestTypeRoutingModule,
    SharedModule
  ]
})
export class RequestTypeModule {
}
