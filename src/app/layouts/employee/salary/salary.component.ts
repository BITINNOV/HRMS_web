import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {Employee} from '../../../shared/models/employee/employee';
import {Organization} from '../../../shared/models/configuration/organization';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthenticationService} from '../../../shared/services/api/authentication.service';
import {EmployeeService} from '../../../shared/services/api/employee/employee.service';
import {GlobalService} from '../../../shared/services/api/global.service';
import {Salary} from '../../../shared/models/employee/salary';
import {SalaryService} from '../../../shared/services/api/employee/salary.service';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.css']
})
export class SalaryComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedSalaries: Array<Salary> = [];
  loading: boolean;
  salaryList: Array<Salary> = [];
  className: string;
  cols: any[];
  editMode: number;
  salaryExportList: Array<Salary> = [];
  listTitle = 'Liste des Salaries';
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
  salary: Salary;
  ids: Array<number>;
  // Component Attributes // Add
  addAmount: number;
  addBeginDate: Date;
  addEndDate: Date;
  addIsActive: boolean;
  addEmployee: Employee;
  // Component Attributes // Update
  updateAmount: number;
  updateBeginDate: Date;
  updateEndDate: Date;
  updateIsActive: boolean;
  updateEmployee: Employee;
  // Component Attributes // Search
  searchSentence: string;
  searchAmount: number;
  searchBeginDate: Date;
  searchEndDate: Date;
  searchIsActive: boolean;
  searchEmployee: Employee;

  constructor(private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private authenticationService: AuthenticationService,
              private employeeService: EmployeeService,
              private globalService: GlobalService,
              private salaryService: SalaryService,
              private confirmationService: ConfirmationService,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' Salary'},
      {label: 'Lister', routerLink: '/core/salary'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = Salary.name;
    this.cols = [
      {field: 'employee', child: 'firstName', header: 'Employee First name', type: 'object'},
      {field: 'employee', child: 'lastName', header: 'Employee Last name', type: 'object'},
      {field: 'amount', header: 'Amount', type: 'number'},
      {field: 'beginDate', header: 'Begin Date', type: 'date'},
      {field: 'endDate', header: 'End Date', type: 'date'},
      {field: 'isActive', header: 'is Active', type: 'boolean'},
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
    this.subscriptions.add(this.salaryService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      },
      error => {
        this.toastr.error(error.message);
      }
    ));
    this.subscriptions.add(this.salaryService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.salaryList = data;
        this.spinner.hide();
      },
      error => {
        this.toastr.error(error.message);
      },
      () => this.spinner.hide()
    ));
    this.subscriptions.add(this.employeeService.find(this.dropDownSearchSentence_Employee).subscribe(
      (data) => {
        this.employeeList = data;
      },
      (error) => {
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
    this.subscriptions.add(this.salaryService.findAll().subscribe(
      data => {
        this.salaryExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.salaryExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.salaryExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.salaryService.findAll().subscribe(
      data => {
        this.salaryExportList = data;
        this.globalService.generatePdf(event, this.salaryExportList, this.className, this.listTitle);
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

    // Check the Amount
    if (this.searchAmount) {
      this.searchSentence += 'amount:' + this.searchAmount + ',';
      index = index + 1;
    }
    // Check the Begin Date
    if (this.searchBeginDate) {
      this.searchSentence += 'beginDate:' + this.searchBeginDate + ',';
      index = index + 1;
    }
    // Check the End Date
    if (this.searchEndDate) {
      this.searchSentence += 'endDate:' + this.searchEndDate + ',';
      index = index + 1;
    }
    // Check the Is Active
    if (this.searchIsActive) {
      this.searchSentence += 'isActive:' + this.searchIsActive + ',';
      index = index + 1;
    } else {
      this.searchSentence += 'isActive:' + false + ',';
      index = index + 1;
    }
    // Check the Employee
    if (this.searchEmployee) {
      this.searchSentence += 'employee.id:' + this.searchEmployee.id + ',';
      index = index + 1;
    }
    if (index > 0 && index === 1) {
      this.searchSentence = this.searchSentence.slice(0, -1);
    } else {
      this.searchSentence = '.' + this.searchSentence.slice(0, -1);
    }

    this.subscriptions.add(this.salaryService.find(this.searchSentence).subscribe(
      (data) => {
        this.salaryList = data;
      },
      (error) => {
        this.toastr.error(error.message);
      }
    ));
  }

  reset() {
    this.searchSentence = null;
    this.searchAmount = null;
    this.searchBeginDate = null;
    this.searchEndDate = null;
    this.searchIsActive = null;
    this.searchEmployee = null;

    this.loadData();
  }

  onObjectEdited(event) {
    this.editMode = event.operationMode;
    this.selectedSalaries = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateAmount = this.selectedSalaries[0].amount;
      this.updateBeginDate = this.selectedSalaries[0].beginDate;
      this.updateEndDate = this.selectedSalaries[0].endDate;
      this.updateIsActive = this.selectedSalaries[0].isActive;
      this.updateEmployee = this.selectedSalaries[0].employee;
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.salary = new Salary();
    this.salary.amount = this.addAmount;
    this.salary.beginDate = this.addBeginDate;
    this.salary.endDate = this.addEndDate;
    this.salary.isActive = this.addIsActive;
    this.salary.employee = this.addEmployee;
    this.salary.organization = this.currentOrganization;

    this.subscriptions.add(this.salaryService.set(this.salary).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.salary = null;
        this.addAmount = null;
        this.addBeginDate = null;
        this.addEndDate = null;
        this.addIsActive = null;
        this.addEmployee = null;
        this.editMode = null;
        this.selectedSalaries = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.salary = null;
        this.addAmount = null;
        this.addBeginDate = null;
        this.addEndDate = null;
        this.addIsActive = null;
        this.addEmployee = null;
        this.editMode = null;
        this.selectedSalaries = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.salary = null;
    this.subscriptions.add(this.salaryService.findById(this.selectedSalaries[0].id).subscribe(
      (data) => {
        this.salary = data;
        this.salary.amount = this.updateAmount;
        this.salary.beginDate = this.updateBeginDate;
        this.salary.endDate = this.updateEndDate;
        this.salary.isActive = this.updateIsActive;
        this.salary.employee = this.updateEmployee;

        if (null !== this.salary) {
          this.subscriptions.add(this.salaryService.set(this.salary).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.salary = null;
              this.editMode = null;
              this.updateAmount = null;
              this.updateBeginDate = null;
              this.updateEndDate = null;
              this.updateIsActive = null;
              this.updateEmployee = null;
              this.selectedSalaries = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.salary = null;
              this.editMode = null;
              this.updateAmount = null;
              this.updateBeginDate = null;
              this.updateEndDate = null;
              this.updateIsActive = null;
              this.updateEmployee = null;
              this.selectedSalaries = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedSalaries.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected salary?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.salaryService.deleteListByIds(ids).subscribe(
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
