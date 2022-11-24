import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ResumeTypeRoutingModule} from './resume-type-routing.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ResumeTypeRoutingModule,
    SharedModule
  ]
})
export class ResumeTypeModule {
}
