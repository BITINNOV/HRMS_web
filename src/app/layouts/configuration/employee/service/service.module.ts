import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ServiceRoutingModule} from './service-routing.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ServiceRoutingModule,
    SharedModule
  ]
})
export class ServiceModule {
}
