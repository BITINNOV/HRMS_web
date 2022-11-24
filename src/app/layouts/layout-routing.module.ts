import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: 'configuration', loadChildren: () => import('./configuration/configuration.module').then(m => m.ConfigurationModule)},
      {path: 'employee', loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule)},
      {path: 'payroll', loadChildren: () => import('./payroll/payroll.module').then(m => m.PayrollModule)},
    ],
  }];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [
    RouterModule,
  ]
})

export class LayoutRoutingModule {
}
