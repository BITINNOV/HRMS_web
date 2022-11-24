import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActionRoutingModule } from './action-routing.module';
import {SharedModule} from '../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ActionRoutingModule,
    SharedModule
  ]
})
export class ActionModule { }
