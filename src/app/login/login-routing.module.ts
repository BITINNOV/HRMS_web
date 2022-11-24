import {LoginComponent} from './login.component';

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    children: [
      {path: 'user', loadChildren: () => import('./login-user/login-user.module').then(m => m.LoginUserModule)},
      // tslint:disable-next-line:max-line-length
      {path: 'organization', loadChildren: () => import('./login-organization/login-organization.module').then(m => m.LoginOrganizationModule)},
    ],
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule,
  ]
})

export class LoginRoutingModule {
}
