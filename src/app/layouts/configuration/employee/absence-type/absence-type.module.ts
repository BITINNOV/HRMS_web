import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AbsenceTypeRoutingModule} from './absence-type-routing.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AbsenceTypeRoutingModule,
    SharedModule
  ]
})
export class AbsenceTypeModule {
}
