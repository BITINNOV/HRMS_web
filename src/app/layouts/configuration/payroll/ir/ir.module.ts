import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {IrRoutingModule} from './ir-routing.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IrRoutingModule,
    SharedModule
  ]
})
export class IrModule {
}
