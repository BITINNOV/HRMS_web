import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LoginOrganizationRoutingModule} from './login-organization-routing.module';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoginOrganizationRoutingModule,
    SharedModule
  ]
})
export class LoginOrganizationModule {
}
