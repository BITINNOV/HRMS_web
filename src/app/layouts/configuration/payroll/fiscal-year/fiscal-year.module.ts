import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FiscalYearRoutingModule} from './fiscal-year-routing.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FiscalYearRoutingModule,
    SharedModule
  ]
})
export class FiscalYearModule {
}
