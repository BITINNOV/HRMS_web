import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LoginUserRoutingModule} from './login-user-routing.module';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoginUserRoutingModule,
    SharedModule
  ]
})
export class LoginUserModule {
}
