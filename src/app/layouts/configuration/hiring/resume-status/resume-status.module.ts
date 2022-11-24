import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ResumeStatusRoutingModule} from './resume-status-routing.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ResumeStatusRoutingModule,
    SharedModule
  ]
})
export class ResumeStatusModule {
}
