import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PublicationLineStatusRoutingModule} from './publication-line-status-routing.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PublicationLineStatusRoutingModule,
    SharedModule
  ]
})
export class PublicationLineStatusModule {
}
