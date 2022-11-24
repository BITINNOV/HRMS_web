import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PublicationStatusRoutingModule} from './publication-status-routing.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PublicationStatusRoutingModule,
    SharedModule
  ]
})
export class PublicationStatusModule {
}
