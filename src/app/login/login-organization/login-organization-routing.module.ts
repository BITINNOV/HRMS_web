import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginOrganizationComponent} from './login-organization.component';

const routes: Routes = [{path: '', component: LoginOrganizationComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginOrganizationRoutingModule {
}
