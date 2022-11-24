import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Advance} from '../../../shared/models/payroll/advance';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {Organization} from '../../../shared/models/configuration/organization';
import {Employee} from '../../../shared/models/employee/employee';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthenticationService} from '../../../shared/services/api/authentication.service';
import {GlobalService} from '../../../shared/services/api/global.service';
import {AdvanceService} from '../../../shared/services/api/payroll/advance.service';
import {EmployeeService} from '../../../shared/services/api/employee/employee.service';

@Component({
  selector: 'app-advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.css']
})
export class AdvanceComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedAdvances: Array<Advance> = [];
  loading: boolean;
  advanceList: Array<Advance> = [];
  className: string;
  cols: any[];
  editMode: number;
  advanceExportList: Array<Advance> = [];
  listTitle = 'Liste des Advances';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];

  // Drop Down
  employeeList: Array<Employee> = [];

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  advance: Advance;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: String;
  addValue: number;
  addAdvanceDate: Date;
  addEmployee: Employee;
  // Component Attributes // Update
  updateCode: String;
  updateValue: number;
  updateAdvanceDate: Date;
  updateEmployee: Employee;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: String;
  searchValue: number;
  searchAdvanceDate: Date;
  searchEmployee: Employee;

  constructor(private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private authenticationService: AuthenticationService,
              private employeeService: EmployeeService,
              private globalService: GlobalService,
              private advanceService: AdvanceService,
              private confirmationService: ConfirmationService,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' Advance'},
      {label: 'Lister', routerLink: '/core/advance'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = Advance.name;
    this.cols = [
      {field: 'code', header: 'Code', type: 'string'},
      {field: 'value', header: ' Value', type: 'number'},
      {field: 'advanceDate', header: 'Advance Date', type: 'date'},
      {field: 'employee', child: 'firstname', header: 'Employee', type: 'object'},
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
    this.subscriptions.add(this.advanceService.size().subscribe(
      data => {
        this.collectionSize = data;
      },
      error => {
        this.toastr.error(error.message);
      }
    ));
    this.subscriptions.add(this.advanceService.findAllPagination(this.page, this.size).subscribe(
      data => {
        this.advanceList = data;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.toastr.error(error.message);
      },
      () => this.spinner.hide()
    ));
    this.subscriptions.add(this.employeeService.findAll().subscribe(
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
    this.subscriptions.add(this.advanceService.findAll().subscribe(
      data => {
        this.advanceExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.advanceExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.advanceExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.advanceService.findAll().subscribe(
      data => {
        this.advanceExportList = data;
        this.globalService.generatePdf(event, this.advanceExportList, this.className, this.listTitle);
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
    // Check the Value
    if (this.searchValue) {
      this.searchSentence += 'value:' + this.searchValue + ',';
      index = index + 1;
    }
    // Check the Advance Date
    if (this.searchAdvanceDate) {
      this.searchSentence += 'advanceDate:' + this.searchAdvanceDate + ',';
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

    this.subscriptions.add(this.advanceService.find(this.searchSentence).subscribe(
      (data) => {
        this.advanceList = data;
      },
      (error) => {
        this.toastr.error(error.message);
      }
    ));
  }

  reset() {
    this.searchSentence = null;
    this.searchCode = null;
    this.searchValue = null;
    this.searchAdvanceDate = null;
    this.searchEmployee = null;

    this.loadData();
  }

  onObjectEdited(event) {
    this.editMode = event.operationMode;
    this.selectedAdvances = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedAdvances[0].code;
      this.updateValue = this.selectedAdvances[0].value;
      this.updateAdvanceDate = this.selectedAdvances[0].advanceDate;
      this.updateEmployee = this.selectedAdvances[0].employee;
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.advance = new Advance();
    this.advance.code = this.addCode;
    this.advance.value = this.addValue;
    this.advance.advanceDate = this.addAdvanceDate;
    this.advance.employee = this.addEmployee;
    this.advance.organization = this.currentOrganization;

    this.subscriptions.add(this.advanceService.set(this.advance).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.advance = null;
        this.addCode = null;
        this.addValue = null;
        this.addAdvanceDate = null;
        this.addEmployee = null;
        this.editMode = null;
        this.selectedAdvances = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.advance = null;
        this.addCode = null;
        this.addValue = null;
        this.addAdvanceDate = null;
        this.addEmployee = null;
        this.editMode = null;
        this.selectedAdvances = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.advance = null;
    this.subscriptions.add(this.advanceService.findById(this.selectedAdvances[0].id).subscribe(
      (data) => {
        this.advance = data;
        this.advance.code = this.updateCode;
        this.advance.value = this.updateValue;
        this.advance.advanceDate = this.updateAdvanceDate;
        this.advance.employee = this.updateEmployee;

        if (null !== this.advance) {
          this.subscriptions.add(this.advanceService.set(this.advance).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.advance = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateValue = null;
              this.updateAdvanceDate = null;
              this.updateEmployee = null;
              this.selectedAdvances = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.advance = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateValue = null;
              this.updateAdvanceDate = null;
              this.updateEmployee = null;
              this.selectedAdvances = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedAdvances.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected advance?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.advanceService.deleteListByIds(ids).subscribe(
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
    const query = event.query;

    for (let i = 0; i < this.employeeList.length; i++) {
      const employee: Employee = this.employeeList[i];
      // tslint:disable-next-line:max-line-length
      if ((employee.firstName.toLowerCase().indexOf(query.toLowerCase()) === 0) || (employee.lastName.toLowerCase().indexOf(query.toLowerCase()) === 0)) {
        filtered.push(employee);
      }
    }

    this.employeeList = filtered;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
