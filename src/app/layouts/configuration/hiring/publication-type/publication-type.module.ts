import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PublicationTypeRoutingModule} from './publication-type-routing.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PublicationTypeRoutingModule,
    SharedModule
  ]
})
export class PublicationTypeModule {
}
