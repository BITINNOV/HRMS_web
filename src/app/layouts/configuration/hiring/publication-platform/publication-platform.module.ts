import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PublicationPlatformRoutingModule} from './publication-platform-routing.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PublicationPlatformRoutingModule,
    SharedModule
  ]
})
export class PublicationPlatformModule {
}
