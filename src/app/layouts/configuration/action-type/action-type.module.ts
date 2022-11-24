import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActionTypeRoutingModule } from './action-type-routing.module';
import {SharedModule} from '../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ActionTypeRoutingModule,
    SharedModule
  ]
})
export class ActionTypeModule { }
