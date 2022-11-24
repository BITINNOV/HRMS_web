import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EstablishmentTypeRoutingModule} from './establishment-type-routing.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EstablishmentTypeRoutingModule,
    SharedModule
  ]
})
export class EstablishmentTypeModule {
}
