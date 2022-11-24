import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OrganizationRoutingModule} from './organization-routing.module';
import {SharedModule} from '../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    OrganizationRoutingModule,
    SharedModule
  ]
})
export class OrganizationModule {
}
