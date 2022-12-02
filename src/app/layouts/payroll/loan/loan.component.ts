import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {Organization} from '../../../shared/models/configuration/organization';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthenticationService} from '../../../shared/services/api/authentication.service';
import {GlobalService} from '../../../shared/services/api/global.service';
import {Loan} from '../../../shared/models/payroll/loan';
import {LoanService} from '../../../shared/services/api/payroll/loan.service';
import {Employee} from '../../../shared/models/employee/employee';
import {EmployeeService} from '../../../shared/services/api/employee/employee.service';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css']
})
export class LoanComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedLoans: Array<Loan> = [];
  loading: boolean;
  loanList: Array<Loan> = [];
  className: string;
  cols: any[];
  editMode: number;
  loanExportList: Array<Loan> = [];
  listTitle = 'Liste des Loans';
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
  loan: Loan;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: String;
  addTotalValue: number;
  addRetained: number;
  addLoanDate: Date;
  addInterestRate: number;
  addEmployee: Employee;
  // Component Attributes // Update
  updateCode: String;
  updateTotalValue: number;
  updateRetained: number;
  updateLoanDate: Date;
  updateInterestRate: number;
  updateEmployee: Employee;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: String;
  searchTotalValue: number;
  searchRetained: number;
  searchLoanDate: Date;
  searchInterestRate: number;
  searchEmployee: Employee;

  constructor(private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private authenticationService: AuthenticationService,
              private employeeService: EmployeeService,
              private globalService: GlobalService,
              private loanService: LoanService,
              private confirmationService: ConfirmationService,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' Loan'},
      {label: 'Lister', routerLink: '/core/loan'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = Loan.name;
    this.cols = [
      {field: 'code', header: 'Code', type: 'string'},
      {field: 'employee', child: 'firstName', header: 'Employee First name', type: 'object'},
      {field: 'employee', child: 'lastName', header: 'Employee Last name', type: 'object'},
      {field: 'totalValue', header: ' Total Value', type: 'number'},
      {field: 'retained', header: 'Retained', type: 'number'},
      {field: 'loanDate', header: 'Loan Date', type: 'date'},
      {field: 'interestRate', header: 'Interest Rate', type: 'number'},
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

    this.spinner.show();
    this.subscriptions.add(this.loanService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      },
      error => {
        this.toastr.error(error.message);
      }
    ));
    this.subscriptions.add(this.loanService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.loanList = data;
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
    this.subscriptions.add(this.loanService.findAll().subscribe(
      data => {
        this.loanExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.loanExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.loanExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.loanService.findAll().subscribe(
      data => {
        this.loanExportList = data;
        this.globalService.generatePdf(event, this.loanExportList, this.className, this.listTitle);
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
    // Check the Total Value
    if (this.searchTotalValue) {
      this.searchSentence += 'totalValue:' + this.searchTotalValue + ',';
      index = index + 1;
    }
    // Check the Retained
    if (this.searchRetained) {
      this.searchSentence += 'retained:' + this.searchRetained + ',';
      index = index + 1;
    }
    // Check the Loan Date
    if (this.searchLoanDate) {
      this.searchSentence += 'loanDate:' + this.searchLoanDate + ',';
      index = index + 1;
    }
    // Check the Interest Rate
    if (this.searchInterestRate) {
      this.searchSentence += 'interestRate:' + this.searchInterestRate + ',';
      index = index + 1;
    }
    // Check the Employee
    if (this.searchEmployee) {
      this.searchSentence += 'fiscalYear.id:' + this.searchEmployee.id + ',';
      index = index + 1;
    }
    if (index > 0 && index === 1) {
      this.searchSentence = this.searchSentence.slice(0, -1);
    } else {
      this.searchSentence = '.' + this.searchSentence.slice(0, -1);
    }

    this.subscriptions.add(this.loanService.find(this.searchSentence).subscribe(
      (data) => {
        this.loanList = data;
      },
      (error) => {
        this.toastr.error(error.message);
      }
    ));
  }

  reset() {
    this.searchSentence = null;
    this.searchCode = null;
    this.searchTotalValue = null;
    this.searchRetained = null;
    this.searchLoanDate = null;
    this.searchInterestRate = null;
    this.searchEmployee = null;

    this.loadData();
  }

  onObjectEdited(event) {
    this.editMode = event.operationMode;
    this.selectedLoans = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedLoans[0].code;
      this.updateTotalValue = this.selectedLoans[0].totalValue;
      this.updateRetained = this.selectedLoans[0].retained;
      this.updateLoanDate = this.selectedLoans[0].loanDate;
      this.updateInterestRate = this.selectedLoans[0].interestRate;
      this.updateEmployee = this.selectedLoans[0].employee;
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.loan = new Loan();
    this.loan.code = this.addCode;
    this.loan.totalValue = this.addTotalValue;
    this.loan.retained = this.addRetained;
    this.loan.loanDate = this.addLoanDate;
    this.loan.interestRate = this.addInterestRate;
    this.loan.employee = this.addEmployee;
    this.loan.organization = this.currentOrganization;

    this.subscriptions.add(this.loanService.set(this.loan).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.loan = null;
        this.addCode = null;
        this.addTotalValue = null;
        this.addRetained = null;
        this.addLoanDate = null;
        this.addInterestRate = null;
        this.addEmployee = null;
        this.editMode = null;
        this.selectedLoans = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.loan = null;
        this.addCode = null;
        this.addTotalValue = null;
        this.addRetained = null;
        this.addLoanDate = null;
        this.addInterestRate = null;
        this.addEmployee = null;
        this.editMode = null;
        this.selectedLoans = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.loan = null;
    this.subscriptions.add(this.loanService.findById(this.selectedLoans[0].id).subscribe(
      (data) => {
        this.loan = data;
        this.loan.code = this.updateCode;
        this.loan.totalValue = this.updateTotalValue;
        this.loan.retained = this.updateRetained;
        this.loan.loanDate = this.updateLoanDate;
        this.loan.interestRate = this.updateInterestRate;
        this.loan.employee = this.updateEmployee;

        if (null !== this.loan) {
          this.subscriptions.add(this.loanService.set(this.loan).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.loan = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateTotalValue = null;
              this.updateRetained = null;
              this.updateLoanDate = null;
              this.updateInterestRate = null;
              this.updateEmployee = null;
              this.selectedLoans = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.loan = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateTotalValue = null;
              this.updateRetained = null;
              this.updateLoanDate = null;
              this.updateInterestRate = null;
              this.updateEmployee = null;
              this.selectedLoans = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedLoans.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected loan?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.loanService.deleteListByIds(ids).subscribe(
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
