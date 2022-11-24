import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TrainingLevelRoutingModule} from './training-level-routing.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TrainingLevelRoutingModule,
    SharedModule
  ]
})
export class TrainingLevelModule {
}
