import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EmployeeComponent} from './employee.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeComponent,
    children: [
      {path: 'service', loadChildren: () => import('./service/service.module').then(m => m.ServiceModule)},
      {path: 'position', loadChildren: () => import('./position/position.module').then(m => m.PositionModule)},
      {path: 'department', loadChildren: () => import('./department/department.module').then(m => m.DepartmentModule)},
      {path: 'directorate', loadChildren: () => import('./directorate/directorate.module').then(m => m.DirectorateModule)},
      {path: 'requestType', loadChildren: () => import('./request-type/request-type.module').then(m => m.RequestTypeModule)},
      {path: 'absenceType', loadChildren: () => import('./absence-type/absence-type.module').then(m => m.AbsenceTypeModule)},
      {path: 'documentType', loadChildren: () => import('./document-type/document-type.module').then(m => m.DocumentTypeModule)},
      {path: 'positiontype', loadChildren: () => import('./position-type/position-type.module').then(m => m.PositionTypeModule)},
      {path: 'requestStatus', loadChildren: () => import('./request-status/request-status.module').then(m => m.RequestStatusModule)},
      {path: 'employeeStatus', loadChildren: () => import('./employee-status/employee-status.module').then(m => m.EmployeeStatusModule)},
      // tslint:disable-next-line:max-line-length
      {path: 'trackingCycleStatus', loadChildren: () => import('./tracking-cycle-status/tracking-cycle-status.module').then(m => m.TrackingCycleStatusModule)},
      // tslint:disable-next-line:max-line-length
      {path: 'expenseAccountStatus', loadChildren: () => import('../payroll/expense-account-status/expense-account-status.module').then(m => m.ExpenseAccountStatusModule)},
      // tslint:disable-next-line:max-line-length
      {path: 'integrationCycleStatus', loadChildren: () => import('./integration-cycle-status/integration-cycle-status.module').then(m => m.IntegrationCycleStatusModule)},
      // tslint:disable-next-line:max-line-length
      {path: 'trackingCycleLineStatus', loadChildren: () => import('./tracking-cycle-line-status/tracking-cycle-line-status.module').then(m => m.TrackingCycleLineStatusModule)},
      // tslint:disable-next-line:max-line-length
      {path: 'integrationCycleLineStatus', loadChildren: () => import('./integration-cycle-line-status/integration-cycle-line-status.module').then(m => m.IntegrationCycleLineStatusModule)},
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
export class EmployeeRoutingModule {
}
