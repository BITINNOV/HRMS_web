import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {FiscalYear} from '../../../shared/models/configuration/payroll/fiscal-year';
import {Organization} from '../../../shared/models/configuration/organization';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthenticationService} from '../../../shared/services/api/authentication.service';
import {FiscalYearService} from '../../../shared/services/api/configuration/payroll/fiscal-year.service';
import {GlobalService} from '../../../shared/services/api/global.service';
import {ExpenseAccountService} from '../../../shared/services/api/payroll/expense-account.service';
import {ExpenseAccountStatus} from '../../../shared/models/configuration/employee/expense-account-status';
import {Employee} from '../../../shared/models/employee/employee';
import {ExpenseAccountStatusService} from '../../../shared/services/api/payroll/expense-account-status.service';
import {ExpenseAccount} from '../../../shared/models/payroll/expense-account';
import {EmployeeService} from '../../../shared/services/api/employee/employee.service';

@Component({
  selector: 'app-expense-account',
  templateUrl: './expense-account.component.html',
  styleUrls: ['./expense-account.component.css']
})
export class ExpenseAccountComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedExpenseAccounts: Array<ExpenseAccount> = [];
  loading: boolean;
  expenseAccountList: Array<ExpenseAccount> = [];
  className: string;
  cols: any[];
  editMode: number;
  expenseAccountExportList: Array<ExpenseAccount> = [];
  listTitle = 'Liste des ExpenseAccounts';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];

  // Drop Down
  employeeList: Array<Employee> = [];
  expenseAccountStatusList: Array<ExpenseAccountStatus> = [];
  dropDownSearchSentence_Employee: string;
  dropDownSearchSentence_ExpenseAccountStatus: string;

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  expenseAccount: ExpenseAccount;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: String;
  addDetails: String;
  addExpenseAccountStatus: ExpenseAccountStatus;
  addComment: String;
  addEmployee: Employee;
  // Component Attributes // Update
  updateCode: String;
  updateDetails: String;
  updateExpenseAccountStatus: ExpenseAccountStatus;
  updateComment: String;
  updateEmployee: Employee;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: String;
  searchDetails: String;
  searchExpenseAccountStatus: ExpenseAccountStatus;
  searchComment: String;
  searchEmployee: Employee;

  constructor(private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private globalService: GlobalService,
              private employeeService: EmployeeService,
              private confirmationService: ConfirmationService,
              private authenticationService: AuthenticationService,
              private expenseAccountService: ExpenseAccountService,
              private expenseAccountStatusService: ExpenseAccountStatusService,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' ExpenseAccount'},
      {label: 'Lister', routerLink: '/core/expenseAccount'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = ExpenseAccount.name;
    this.cols = [
      {field: 'code', header: 'Code', type: 'string'},
      {field: 'employee', child: 'firstName', header: 'Employee First name', type: 'object'},
      {field: 'employee', child: 'lastName', header: 'Employee Last name', type: 'object'},
      {field: 'details', header: 'Details', type: 'string'},
      {field: 'comment', header: 'Comment', type: 'string'},
      {field: 'expenseAccountStatus', child: 'code', header: 'Expense Account Status', type: 'object'},
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
    // Drop Down search For Expense Account Status
    this.dropDownSearchSentence_ExpenseAccountStatus = '';
    this.dropDownSearchSentence_ExpenseAccountStatus += 'organization.code:' + this.currentOrganization.code;

    this.subscriptions.add(this.expenseAccountService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      },
      error => {
        this.toastr.error(error.message);
      }
    ));
    this.subscriptions.add(this.expenseAccountService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.expenseAccountList = data;
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
    this.subscriptions.add(this.expenseAccountStatusService.find(this.dropDownSearchSentence_ExpenseAccountStatus).subscribe(
      (data) => {
        this.expenseAccountStatusList = data;
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
    this.spinner.show();
    // Set Current Organization
    this.currentOrganization = this.authenticationService.getCurrentOrganization();
    // List search sentence
    this.searchSentence = '';
    this.searchSentence = 'organization.code:' + this.currentOrganization.code;

    this.subscriptions.add(this.expenseAccountService.find(this.searchSentence).subscribe(
      data => {
        this.expenseAccountExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.expenseAccountExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.expenseAccountExportList, this.className, this.listTitle);
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
    this.spinner.show();
    // Set Current Organization
    this.currentOrganization = this.authenticationService.getCurrentOrganization();
    // List search sentence
    this.searchSentence = '';
    this.searchSentence = 'organization.code:' + this.currentOrganization.code;

    this.subscriptions.add(this.expenseAccountService.find(this.searchSentence).subscribe(
      data => {
        this.expenseAccountExportList = data;
        this.globalService.generatePdf(event, this.expenseAccountExportList, this.className, this.listTitle);
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

    // Check the Code
    if (this.searchCode) {
      this.searchSentence += 'code:' + this.searchCode + ',';
      index = index + 1;
    }
    // Check the Details
    if (this.searchDetails) {
      this.searchSentence += 'details:' + this.searchDetails + ',';
      index = index + 1;
    }
    // Check the Expense Account Status
    if (this.searchExpenseAccountStatus) {
      this.searchSentence += 'expenseAccountStatus.id:' + this.searchExpenseAccountStatus.id + ',';
      index = index + 1;
    }
    // Check the Comment
    if (this.searchComment) {
      this.searchSentence += 'comment:' + this.searchComment + ',';
      index = index + 1;
    }
    // Check the Expense Account Status
    if (this.searchEmployee) {
      this.searchSentence += 'employee.id:' + this.searchEmployee.id + ',';
      index = index + 1;
    }
    if (index > 0 && index === 1) {
      this.searchSentence = this.searchSentence.slice(0, -1);
    } else {
      this.searchSentence = '.' + this.searchSentence.slice(0, -1);
    }

    this.subscriptions.add(this.expenseAccountService.find(this.searchSentence).subscribe(
      (data) => {
        this.expenseAccountList = data;
      },
      (error) => {
        this.toastr.error(error.message);
      }
    ));
  }

  reset() {
    this.searchSentence = null;
    this.searchCode = null;
    this.searchDetails = null;
    this.searchComment = null;
    this.searchExpenseAccountStatus = null;
    this.searchEmployee = null;

    this.loadData();
  }

  onObjectEdited(event) {
    this.editMode = event.operationMode;
    this.selectedExpenseAccounts = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedExpenseAccounts[0].code;
      this.updateDetails = this.selectedExpenseAccounts[0].details;
      this.updateComment = this.selectedExpenseAccounts[0].comment;
      this.updateEmployee = this.selectedExpenseAccounts[0].employee;
      this.updateExpenseAccountStatus = this.selectedExpenseAccounts[0].expenseAccountStatus;
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.expenseAccount = new ExpenseAccount();
    this.expenseAccount.code = this.addCode;
    this.expenseAccount.details = this.addDetails;
    this.expenseAccount.comment = this.addComment;
    this.expenseAccount.employee = this.addEmployee;
    this.expenseAccount.organization = this.currentOrganization;
    this.expenseAccount.expenseAccountStatus = this.addExpenseAccountStatus;

    this.subscriptions.add(this.expenseAccountService.set(this.expenseAccount).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.expenseAccount = null;
        this.addCode = null;
        this.addDetails = null;
        this.addComment = null;
        this.addEmployee = null;
        this.addExpenseAccountStatus = null;
        this.editMode = null;
        this.selectedExpenseAccounts = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.expenseAccount = null;
        this.addCode = null;
        this.addDetails = null;
        this.addComment = null;
        this.addEmployee = null;
        this.addExpenseAccountStatus = null;
        this.editMode = null;
        this.selectedExpenseAccounts = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.expenseAccount = null;
    this.subscriptions.add(this.expenseAccountService.findById(this.selectedExpenseAccounts[0].id).subscribe(
      (data) => {
        this.expenseAccount = data;
        this.expenseAccount.code = this.updateCode;
        this.expenseAccount.details = this.updateDetails;
        this.expenseAccount.comment = this.updateComment;
        this.expenseAccount.employee = this.updateEmployee;
        this.expenseAccount.expenseAccountStatus = this.updateExpenseAccountStatus;

        if (null !== this.expenseAccount) {
          this.subscriptions.add(this.expenseAccountService.set(this.expenseAccount).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.expenseAccount = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateDetails = null;
              this.updateComment = null;
              this.updateEmployee = null;
              this.updateExpenseAccountStatus = null;
              this.selectedExpenseAccounts = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.expenseAccount = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateDetails = null;
              this.updateComment = null;
              this.updateEmployee = null;
              this.updateExpenseAccountStatus = null;
              this.selectedExpenseAccounts = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedExpenseAccounts.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected expenseAccount?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.expenseAccountService.deleteListByIds(ids).subscribe(
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

  filterExpenseAccountStatus(event) {
    // in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    const filtered: any[] = [];
    const code = event.query;

    if (code) {
      for (let i = 0; i < this.expenseAccountStatusList.length; i++) {
        const expenseAccountStatus = this.expenseAccountStatusList[i];
        if (expenseAccountStatus.code.toLowerCase().indexOf(code.toLowerCase()) === 0) {
          filtered.push(expenseAccountStatus);
        }
      }
      this.expenseAccountStatusList = filtered;
    } else {
      this.subscriptions.add(this.expenseAccountStatusService.find(this.dropDownSearchSentence_ExpenseAccountStatus).subscribe(
        (data) => {
          this.expenseAccountStatusList = data;
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
