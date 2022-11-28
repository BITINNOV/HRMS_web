import {StepsModule} from 'primeng/steps';
import {SelectButtonModule} from 'primeng/selectbutton';
import {InputNumberModule} from 'primeng/inputnumber';
import {ToastModule} from 'primeng/toast';
import {DialogModule} from 'primeng/dialog';
import {SplitButtonModule} from 'primeng/splitbutton';
import {MultiSelectModule} from 'primeng/multiselect';
import {PanelModule} from 'primeng/panel';
import {TabViewModule} from 'primeng/tabview';
import {CheckboxModule} from 'primeng/checkbox';
import {KeyFilterModule} from 'primeng/keyfilter';
import {InputTextModule} from 'primeng/inputtext';
import {CalendarModule} from 'primeng/calendar';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {TranslateModule} from '@ngx-translate/core';
import {ContextMenuModule} from 'primeng/contextmenu';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {NgxSpinnerModule} from 'ngx-spinner';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmationService, MessageService} from 'primeng/api';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModuleWithProviders} from '@angular/compiler/src/core';
import {FieldsetModule} from 'primeng/fieldset';
import {DataTableComponent} from './components/data-table/data-table.component';
import {NgxPermissionsModule} from 'ngx-permissions';
import {HasPermissionDirective} from './directive/hasPermission.directive';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {GlobalService} from './services/api/global.service';
import {UserService} from './services/api/configuration/user.service';
import {FormsModule} from '@angular/forms';
import {LanguageLevelService} from './services/api/configuration/hiring/language-level.service';
import {SkillAreaService} from './services/api/configuration/hiring/skill-area.service';
import {EstablishmentTypeService} from './services/api/configuration/hiring/establishment-type.service';
import {TrainingLevelService} from './services/api/configuration/hiring/training-level.service';
import {TrainingTypeService} from './services/api/configuration/hiring/training-type.service';
import {ResumeStatusService} from './services/api/configuration/hiring/resume-status.service';
import {DisabilityNatureService} from './services/api/configuration/hiring/disability-nature.service';
import {ResumeTypeService} from './services/api/configuration/hiring/resume-type.service';
import {HiringTypeService} from './services/api/configuration/hiring/hiring-type.service';
import {NeedStatusService} from './services/api/configuration/hiring/need-status.service';
import {PublicationTypeService} from './services/api/configuration/hiring/publication-type.service';
import {PublicationStatusService} from './services/api/configuration/hiring/publication-status.service';
import {PublicationLineStatusService} from './services/api/configuration/hiring/publication-line-status.service';
import {HiringCycleTypeService} from './services/api/configuration/hiring/hiring-cycle-type.service';
import {IntegrationCycleLineStatusService} from './services/api/configuration/employee/integration-cycle-line-status.service';
import {IntegrationCycleStatusService} from './services/api/configuration/employee/integration-cycle-status.service';
import {DocumentTypeService} from './services/api/configuration/employee/document-type.service';
import {ExpenseAccountStatusService} from './services/api/payroll/expense-account-status.service';
import {AbsenceTypeService} from './services/api/configuration/employee/absence-type.service';
import {TrackingCycleStatusService} from './services/api/configuration/employee/tracking-cycle-status.service';
import {TrackingCycleLineStatusService} from './services/api/configuration/employee/tracking-cycle-line-status.service';
import {EmployeeStatusService} from './services/api/configuration/employee/employee-status.service';
import {RequestTypeService} from './services/api/configuration/employee/request-type.service';
import {RequestStatusService} from './services/api/configuration/employee/request-status.service';
import {DirectorateService} from './services/api/configuration/employee/directorate.service';
import {OrganizationService} from './services/api/configuration/organization.service';
import {CountryService} from './services/api/configuration/country.service';
import {ValidationCycleStatusService} from './services/api/configuration/validation-cycle-status.service';
import {ValidationCycleLineStatusService} from './services/api/configuration/validation-cycle-line-status.service';
import {ActionService} from './services/api/configuration/action.service';
import {ActionTypeService} from './services/api/configuration/action-type.service';
import {RegionService} from './services/api/configuration/region.service';
import {ContractTypeService} from './services/api/configuration/hiring/contract-type.service';
import {HiringCycleService} from './services/api/configuration/hiring/hiring-cycle.service';
import {HiringPhaseService} from './services/api/configuration/hiring/hiring-phase.service';
import {PublicationPlatformService} from './services/api/configuration/hiring/publication-platform.service';
import {AdvanceService} from './services/api/payroll/advance.service';
import {AmoService} from './services/api/configuration/payroll/amo.service';
import {CnssService} from './services/api/configuration/payroll/cnss.service';
import {FiscalYearService} from './services/api/configuration/payroll/fiscal-year.service';
import {DepartmentService} from './services/api/configuration/employee/department.service';
import {DocumentTermsService} from './services/api/configuration/employee/document-terms.service';
import {FixedBonusService} from './services/api/payroll/fixed-bonus.service';
import {IrService} from './services/api/configuration/payroll/ir.service';
import {NapcService} from './services/api/configuration/payroll/napc.service';
import {SeniorityService} from './services/api/configuration/payroll/seniority.service';
import {ServiceService} from './services/api/configuration/employee/service.service';
import {PositionTypeService} from './services/api/configuration/employee/position-type.service';
import {PositionService} from './services/api/configuration/employee/position.service';
import {MutualInsuranceService} from './services/api/configuration/payroll/mutual-insurance.service';
import {LoanService} from './services/api/payroll/loan.service';
import {VariableBonusService} from './services/api/payroll/variable-bonus.service';
import {ExpenseAccountService} from './services/api/payroll/expense-account.service';
import {EmployeeService} from './services/api/employee/employee.service';
import {PayrollStatementService} from './services/api/payroll/payroll-statement.service';
import {PayrollBookService} from './services/api/payroll/payroll-book.service';


@NgModule({
  declarations: [
    DataTableComponent,
    HasPermissionDirective
  ],

  imports: [
    CommonModule,
    FieldsetModule,
    TranslateModule,
    InputTextModule,
    TableModule,
    DropdownModule,
    AutoCompleteModule,
    NgxSpinnerModule,
    CalendarModule,
    ConfirmDialogModule,
    TabViewModule,
    KeyFilterModule,
    NgbModalModule,
    NgxSpinnerModule,
    ContextMenuModule,
    StepsModule,
    PanelModule,
    SelectButtonModule,
    InputNumberModule,
    DialogModule,
    MultiSelectModule,
    ToastModule,
    BreadcrumbModule,
    SplitButtonModule,
    CheckboxModule,
  ],

  exports: [
    DataTableComponent,
    NgxPermissionsModule,
    HasPermissionDirective,
    TranslateModule,
    InputTextModule,
    TableModule,
    DropdownModule,
    AutoCompleteModule,
    NgxSpinnerModule,
    CalendarModule,
    ConfirmDialogModule,
    TabViewModule,
    KeyFilterModule,
    NgbModalModule,
    NgxSpinnerModule,
    ContextMenuModule,
    StepsModule,
    PanelModule,
    SelectButtonModule,
    InputNumberModule,
    DialogModule,
    MultiSelectModule,
    ToastModule,
    BreadcrumbModule,
    CheckboxModule,
    FormsModule
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        MessageService,
        ConfirmationService,
        MessageService,
        GlobalService,
        UserService,
        CountryService,
        OrganizationService,
        ValidationCycleStatusService,
        ValidationCycleLineStatusService,
        DirectorateService,
        RequestStatusService,
        RequestTypeService,
        EmployeeStatusService,
        TrackingCycleLineStatusService,
        TrackingCycleStatusService,
        AbsenceTypeService,
        ExpenseAccountStatusService,
        DocumentTypeService,
        IntegrationCycleStatusService,
        IntegrationCycleLineStatusService,
        HiringCycleTypeService,
        PublicationLineStatusService,
        PublicationStatusService,
        PublicationTypeService,
        NeedStatusService,
        HiringTypeService,
        ResumeTypeService,
        DisabilityNatureService,
        ResumeStatusService,
        TrainingTypeService,
        TrainingLevelService,
        EstablishmentTypeService,
        SkillAreaService,
        LanguageLevelService,
        ActionService,
        ActionTypeService,
        RegionService,
        ContractTypeService,
        HiringCycleService,
        HiringPhaseService,
        PublicationPlatformService,
        AdvanceService,
        AmoService,
        CnssService,
        DepartmentService,
        DocumentTermsService,
        FiscalYearService,
        FixedBonusService,
        IrService,
        NapcService,
        SeniorityService,
        ServiceService,
        PositionTypeService,
        PositionService,
        MutualInsuranceService,
        LoanService,
        VariableBonusService,
        ExpenseAccountService,
        EmployeeService,
        PayrollStatementService,
        PayrollBookService,
      ],
    };
  }
}
