import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {Organization} from '../../../shared/models/configuration/organization';
import {Employee} from '../../../shared/models/employee/employee';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthenticationService} from '../../../shared/services/api/authentication.service';
import {GlobalService} from '../../../shared/services/api/global.service';
import {PayrollStatement} from '../../../shared/models/payroll/payroll-statement';
import {PayrollStatementService} from '../../../shared/services/api/payroll/payroll-statement.service';
import {EmployeeService} from '../../../shared/services/api/employee/employee.service';

@Component({
  selector: 'app-payroll-statement',
  templateUrl: './payroll-statement.component.html',
  styleUrls: ['./payroll-statement.component.css']
})
export class PayrollStatementComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedPayrollStatements: Array<PayrollStatement> = [];
  loading: boolean;
  payrollStatementList: Array<PayrollStatement> = [];
  className: string;
  cols: any[];
  editMode: number;
  payrollStatementExportList: Array<PayrollStatement> = [];
  listTitle = 'Liste des PayrollStatements';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];

  // Drop Down
  employeeList: Array<Employee> = [];
  dropDownSearchSentence_Employee: string;

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  payrollStatement: PayrollStatement;
  ids: Array<number>;
  // Component Attributes // Add
  addInputDate: Date;
  addIncreaseRate: number;
  addNumberHoursWorked: number;
  addNumberBankHolidays: number;
  addNumberPaidLeave: number;
  addEmployee: Employee;
  // Component Attributes // Update
  updateInputDate: Date;
  updateIncreaseRate: number;
  updateNumberHoursWorked: number;
  updateNumberBankHolidays: number;
  updateNumberPaidLeave: number;
  updateEmployee: Employee;
  // Component Attributes // Search
  searchSentence: string;
  searchInputDate: Date;
  searchIncreaseRate: number;
  searchNumberHoursWorked: number;
  searchNumberBankHolidays: number;
  searchNumberPaidLeave: number;
  searchEmployee: Employee;

  constructor(private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private authenticationService: AuthenticationService,
              private employeeService: EmployeeService,
              private globalService: GlobalService,
              private payrollStatementService: PayrollStatementService,
              private confirmationService: ConfirmationService,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' PayrollStatement'},
      {label: 'Lister', routerLink: '/core/payrollStatement'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = PayrollStatement.name;
    this.cols = [
      {field: 'employee', child: 'firstName', header: 'Employee First name', type: 'object'},
      {field: 'employee', child: 'lastName', header: 'Employee Last name', type: 'object'},
      {field: 'inputDate', header: 'Input Date', type: 'date'},
      {field: 'increaseRate', header: 'Increase Rate', type: 'number'},
      {field: 'numberHoursWorked', header: 'Number Hours Worked', type: 'number'},
      {field: 'numberBankHolidays', header: 'Number Bank Holidays', type: 'number'},
      {field: 'numberPaidLeave', header: 'Number Paid Leave', type: 'number'},
    ];
    this.selectedColumns = this.cols;
    /*this.selectedColumns = this.Columns;
    this.items = [
      {label: 'En PDF', icon: 'pi pi-file-pdf', command: () => { this.exportPdf(); }},
      {label: 'En EXCEL Vue', icon: 'pi pi-file-excel', command: () => { this.exportExcelVue(); }},
      {label: 'En EXCEL Globale', icon: 'pi pi-file-excel', command: () => { this.exportExcelGlobal(); }},
    ];*/
    this.loadData();
  }

  loadData() {
    this.spinner.show();
    // Set Current Organization
    this.currentOrganization = this.authenticationService.getCurrentOrganization();
    // List search sentence
    this.searchSentence = '';
    this.searchSentence = 'organization.code:' + this.currentOrganization.code;
    // Drop Down search For Employee
    this.dropDownSearchSentence_Employee = '';
    this.dropDownSearchSentence_Employee += 'organization.code:' + this.currentOrganization.code;

    this.subscriptions.add(this.payrollStatementService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      },
      error => {
        this.toastr.error(error.message);
      }
    ));
    this.subscriptions.add(this.payrollStatementService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.payrollStatementList = data;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.toastr.error(error.message);
      },
      () => this.spinner.hide()
    ));
    this.subscriptions.add(this.employeeService.find(this.dropDownSearchSentence_Employee).subscribe(
      (data) => {
        this.employeeList = data;
      },
      (error) => {
        this.spinner.hide();
        this.toastr.error(error.message);
      },
      () => this.spinner.hide()
    ));
  }

  loadDataLazy(event) {
    this.size = event.rows;
    this.page = event.first / this.size;
    this.loadData();
  }

  onExportExcel(event) {
    this.subscriptions.add(this.payrollStatementService.findAll().subscribe(
      data => {
        this.payrollStatementExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.payrollStatementExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.payrollStatementExportList, this.className, this.listTitle);
        }
        this.spinner.hide();
      },
      error => {
        this.toastr.error(error.message);
        this.spinner.hide();
      },
      () => this.spinner.hide()
    ));
  }

  onExportPdf(event) {
    this.subscriptions.add(this.payrollStatementService.findAll().subscribe(
      data => {
        this.payrollStatementExportList = data;
        this.globalService.generatePdf(event, this.payrollStatementExportList, this.className, this.listTitle);
        this.spinner.hide();
      },
      error => {
        this.toastr.error(error.message);
        this.spinner.hide();
      },
      () => this.spinner.hide()
    ));
  }

  search() {
    this.searchSentence = '';
    let index = 0;

    // Check the Employee
    if (this.searchEmployee) {
      this.searchSentence += 'employee.id:' + this.searchEmployee.id + ',';
      index = index + 1;
    }
    // Check the Input Date
    if (this.searchInputDate) {
      this.searchSentence += 'inputDate:' + this.searchInputDate + ',';
      index = index + 1;
    }
    // Check the Increase Rate
    if (this.searchIncreaseRate) {
      this.searchSentence += 'increaseRate:' + this.searchIncreaseRate + ',';
      index = index + 1;
    }
    // Check the Number Hours Worked
    if (this.searchNumberHoursWorked) {
      this.searchSentence += 'numberHoursWorked:' + this.searchNumberHoursWorked + ',';
      index = index + 1;
    }
    // Check the Number Bank Holidays
    if (this.searchNumberBankHolidays) {
      this.searchSentence += 'numberBankHolidays:' + this.searchNumberBankHolidays + ',';
      index = index + 1;
    }
    // Check the Number Paid Leave
    if (this.searchNumberPaidLeave) {
      this.searchSentence += 'numberPaidLeave:' + this.searchNumberPaidLeave + ',';
      index = index + 1;
    }
    if (index > 0 && index === 1) {
      this.searchSentence = this.searchSentence.slice(0, -1);
    } else {
      this.searchSentence = '.' + this.searchSentence.slice(0, -1);
    }

    this.subscriptions.add(this.payrollStatementService.find(this.searchSentence).subscribe(
      (data) => {
        this.payrollStatementList = data;
      },
      (error) => {
        this.toastr.error(error.message);
      }
    ));
  }

  reset() {
    this.searchSentence = null;
    this.searchEmployee = null;
    this.searchInputDate = null;
    this.searchIncreaseRate = null;
    this.searchNumberHoursWorked = null;
    this.searchNumberBankHolidays = null;
    this.searchNumberPaidLeave = null;

    this.loadData();
  }

  onObjectEdited(event) {
    this.editMode = event.operationMode;
    this.selectedPayrollStatements = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateEmployee = this.selectedPayrollStatements[0].employee;
      this.updateInputDate = this.selectedPayrollStatements[0].inputDate;
      this.updateIncreaseRate = this.selectedPayrollStatements[0].increaseRate;
      this.updateNumberHoursWorked = this.selectedPayrollStatements[0].numberHoursWorked;
      this.updateNumberBankHolidays = this.selectedPayrollStatements[0].numberBankHolidays;
      this.updateNumberPaidLeave = this.selectedPayrollStatements[0].numberPaidLeave;
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.payrollStatement = new PayrollStatement();
    this.payrollStatement.employee = this.addEmployee;
    this.payrollStatement.inputDate = this.addInputDate;
    this.payrollStatement.increaseRate = this.addIncreaseRate;
    this.payrollStatement.numberHoursWorked = this.addNumberHoursWorked;
    this.payrollStatement.numberBankHolidays = this.addNumberBankHolidays;
    this.payrollStatement.numberPaidLeave = this.addNumberPaidLeave;
    this.payrollStatement.organization = this.currentOrganization;
    console.log(this.payrollStatement);
    this.subscriptions.add(this.payrollStatementService.set(this.payrollStatement).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.payrollStatement = null;
        this.addEmployee = null;
        this.addInputDate = null;
        this.addIncreaseRate = null;
        this.addNumberHoursWorked = null;
        this.addNumberBankHolidays = null;
        this.addNumberPaidLeave = null;
        this.editMode = null;
        this.selectedPayrollStatements = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.payrollStatement = null;
        this.addEmployee = null;
        this.addInputDate = null;
        this.addIncreaseRate = null;
        this.addNumberHoursWorked = null;
        this.addNumberBankHolidays = null;
        this.addNumberPaidLeave = null;
        this.editMode = null;
        this.selectedPayrollStatements = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.payrollStatement = null;
    this.subscriptions.add(this.payrollStatementService.findById(this.selectedPayrollStatements[0].id).subscribe(
      (data) => {
        this.payrollStatement = data;
        this.payrollStatement.employee = this.updateEmployee;
        this.payrollStatement.inputDate = this.updateInputDate;
        this.payrollStatement.increaseRate = this.updateIncreaseRate;
        this.payrollStatement.numberHoursWorked = this.updateNumberHoursWorked;
        this.payrollStatement.numberBankHolidays = this.updateNumberBankHolidays;
        this.payrollStatement.numberPaidLeave = this.updateNumberPaidLeave;

        if (null !== this.payrollStatement) {
          this.subscriptions.add(this.payrollStatementService.set(this.payrollStatement).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.payrollStatement = null;
              this.updateEmployee = null;
              this.updateInputDate = null;
              this.updateIncreaseRate = null;
              this.updateNumberHoursWorked = null;
              this.updateNumberBankHolidays = null;
              this.updateNumberPaidLeave = null;
              this.selectedPayrollStatements = null;
              this.dialogDisplayEdit = false;
              this.editMode = null;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.payrollStatement = null;
              this.updateEmployee = null;
              this.updateInputDate = null;
              this.updateIncreaseRate = null;
              this.updateNumberHoursWorked = null;
              this.updateNumberBankHolidays = null;
              this.updateNumberPaidLeave = null;
              this.selectedPayrollStatements = null;
              this.dialogDisplayEdit = false;
              this.editMode = null;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedPayrollStatements.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected payrollStatement?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.payrollStatementService.deleteListByIds(ids).subscribe(
          (data) => {
            this.toastr.success('Elément Supprimer avec Succés', 'Suppression');
            this.loadData();
          },
          (error) => {
            this.toastr.error(error.message);
            this.loadData();
          }
        ));
      }
    });
  }

  filterEmployee(event) {
    // in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    const filtered: any[] = [];
    const firstOrLastName = event.query;

    if (firstOrLastName) {
      for (let i = 0; i < this.employeeList.length; i++) {
        const employee = this.employeeList[i];
        // tslint:disable-next-line:max-line-length
        if ((employee.firstName.toLowerCase().indexOf(firstOrLastName.toLowerCase()) === 0) || (employee.lastName.toLowerCase().indexOf(firstOrLastName.toLowerCase()) === 0)) {
          filtered.push(employee);
        }
      }
      this.employeeList = filtered;
    } else {
      this.subscriptions.add(this.employeeService.find(this.dropDownSearchSentence_Employee).subscribe(
        (data) => {
          this.employeeList = data;
        },
        (error) => {
          this.spinner.hide();
          this.toastr.error(error.message);
        },
        () => this.spinner.hide()
      ));
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
