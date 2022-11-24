import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CountryRoutingModule} from './country-routing.module';
import {SharedModule} from '../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CountryRoutingModule,
    SharedModule
  ]
})
export class CountryModule {
}
