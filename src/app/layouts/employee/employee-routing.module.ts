import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EmployeeComponent} from './employee.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeComponent,
    children: [
      {path: 'employee', loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule)},
      {path: 'salary', loadChildren: () => import('./salary/salary.module').then(m => m.SalaryModule)},
    ],
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule {
}
