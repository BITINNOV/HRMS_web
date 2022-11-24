import {TranslateModule} from '@ngx-translate/core';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginRoutingModule} from './login-routing.module';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {NgxSpinnerModule} from 'ngx-spinner';
import {DropdownModule} from 'primeng/dropdown';
import {LoginUserComponent} from './login-user/login-user.component';
import {LoginOrganizationComponent} from './login-organization/login-organization.component';
import {LoginComponent} from './login.component';
import {SharedModule} from '../shared/shared.module';


@NgModule({
  declarations: [
    LoginComponent,
    LoginUserComponent,
    LoginOrganizationComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    LoginRoutingModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    NgxSpinnerModule,
    DropdownModule,
    SharedModule
  ]
})
export class LoginModule {
}
