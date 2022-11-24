import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConfigurationComponent} from './configuration.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationComponent,
    children: [
      {path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule)},
      {path: 'action', loadChildren: () => import('./action/action.module').then(m => m.ActionModule)},
      {path: 'region', loadChildren: () => import('./region/region.module').then(m => m.RegionModule)},
      {path: 'country', loadChildren: () => import('./country/country.module').then(m => m.CountryModule)},
      {path: 'actiontype', loadChildren: () => import('./action-type/action-type.module').then(m => m.ActionTypeModule)},
      {path: 'organization', loadChildren: () => import('./organization/organization.module').then(m => m.OrganizationModule)},
      // tslint:disable-next-line:max-line-length
      {path: 'validationcyclestatus', loadChildren: () => import('./validationcyclestatus/validationCycleStatus.module').then(m => m.ValidationCycleStatusModule)},
      // tslint:disable-next-line:max-line-length
      {path: 'validationcyclelinestatus', loadChildren: () => import('./validationcyclelinestatus/validationCycleLineStatus.module').then(m => m.ValidationCycleLineStatusModule)},
      // tslint:disable-next-line:max-line-length
      {path: 'employee', loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule)},
      {path: 'hiring', loadChildren: () => import('./hiring/hiring.module').then(m => m.HiringModule)},
      {path: 'payroll', loadChildren: () => import('./payroll/payroll.module').then(m => m.PayrollModule)},
    ],
  }];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ConfigurationRoutingModule {
}
