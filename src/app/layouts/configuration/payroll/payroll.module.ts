import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PayrollRoutingModule} from './payroll-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import { AmoComponent } from './amo/amo.component';
import { CnssComponent } from './cnss/cnss.component';
import { IrComponent } from './ir/ir.component';
import { NapcComponent } from './napc/napc.component';
import { SeniorityComponent } from './seniority/seniority.component';
import { MutualInsuranceComponent } from './mutual-insurance/mutual-insurance.component';
import { FiscalYearComponent } from './fiscal-year/fiscal-year.component';
import {TriStateCheckboxModule} from 'primeng/tristatecheckbox';


@NgModule({
  declarations: [AmoComponent, CnssComponent, IrComponent, NapcComponent, SeniorityComponent, MutualInsuranceComponent, FiscalYearComponent],
    imports: [
        CommonModule,
        PayrollRoutingModule,
        SharedModule,
        TriStateCheckboxModule
    ]
})
export class PayrollModule {
}
