import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MutualInsuranceRoutingModule} from './mutual-insurance-routing.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MutualInsuranceRoutingModule,
    SharedModule
  ]
})
export class MutualInsuranceModule {
}
