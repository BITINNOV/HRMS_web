import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EmployeeRoutingModule} from './employee-routing.module';
import {DirectorateComponent} from './directorate/directorate.component';
import {RequestStatusComponent} from './request-status/request-status.component';
import {RequestTypeComponent} from './request-type/request-type.component';
import {EmployeeStatusComponent} from './employee-status/employee-status.component';
import {TrackingCycleStatusComponent} from './tracking-cycle-status/tracking-cycle-status.component';
import {TrackingCycleLineStatusComponent} from './tracking-cycle-line-status/tracking-cycle-line-status.component';
import {AbsenceTypeComponent} from './absence-type/absence-type.component';
import {ExpenseAccountStatusComponent} from '../payroll/expense-account-status/expense-account-status.component';
import {DocumentTypeComponent} from './document-type/document-type.component';
import {IntegrationCycleStatusComponent} from './integration-cycle-status/integration-cycle-status.component';
import {IntegrationCycleLineStatusComponent} from './integration-cycle-line-status/integration-cycle-line-status.component';
import {EmployeeComponent} from './employee.component';
import {SharedModule} from '../../../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {DepartmentComponent} from './department/department.component';
import {DocumentTermsComponent} from './document-terms/document-terms.component';
import {ServiceComponent} from './service/service.component';
import {PositionComponent} from './position/position.component';
import {PositionTypeComponent} from './position-type/position-type.component';


@NgModule({
  declarations: [
    EmployeeComponent,
    DirectorateComponent,
    RequestStatusComponent,
    RequestTypeComponent,
    EmployeeStatusComponent,
    TrackingCycleStatusComponent,
    TrackingCycleLineStatusComponent,
    AbsenceTypeComponent,
    ExpenseAccountStatusComponent,
    DocumentTypeComponent,
    IntegrationCycleStatusComponent,
    IntegrationCycleLineStatusComponent,
    DepartmentComponent,
    DocumentTermsComponent,
    ServiceComponent,
    PositionComponent,
    PositionTypeComponent
  ],
  imports: [
    EmployeeRoutingModule,
    CommonModule,
    SharedModule,
    FormsModule
  ]
})
export class EmployeeModule {
}
