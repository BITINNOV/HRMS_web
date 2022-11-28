import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {FiscalYear} from '../../../shared/models/configuration/payroll/fiscal-year';
import {Organization} from '../../../shared/models/configuration/organization';
import {Employee} from '../../../shared/models/employee/employee';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthenticationService} from '../../../shared/services/api/authentication.service';
import {FiscalYearService} from '../../../shared/services/api/configuration/payroll/fiscal-year.service';
import {GlobalService} from '../../../shared/services/api/global.service';
import {VariableBonus} from '../../../shared/models/payroll/variable-bonus';
import {VariableBonusService} from '../../../shared/services/api/payroll/variable-bonus.service';

@Component({
  selector: 'app-variable-bonus',
  templateUrl: './variable-bonus.component.html',
  styleUrls: ['./variable-bonus.component.css']
})
export class VariableBonusComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedVariableBonuses: Array<VariableBonus> = [];
  loading: boolean;
  variableBonusList: Array<VariableBonus> = [];
  className: string;
  cols: any[];
  editMode: number;
  variableBonusExportList: Array<VariableBonus> = [];
  listTitle = 'Liste des VariableBonuses';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];

  // Drop Down
  fiscalYearList: Array<FiscalYear> = [];

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  variableBonus: VariableBonus;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: String;
  addValue: number;
  addTaxRates: number;
  addVariableBonusDate: Date;
  addEmployee: Employee;
  // Component Attributes // Update
  updateCode: String;
  updateValue: number;
  updateTaxRates: number;
  updateVariableBonusDate: Date;
  updateEmployee: Employee;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: String;
  searchValue: number;
  searchTaxRates: number;
  searchVariableBonusDate: Date;
  searchEmployee: Employee;

  constructor(private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private authenticationService: AuthenticationService,
              private fiscalYearService: FiscalYearService,
              private globalService: GlobalService,
              private variableBonusService: VariableBonusService,
              private confirmationService: ConfirmationService,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' VariableBonus'},
      {label: 'Lister', routerLink: '/core/variableBonus'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = VariableBonus.name;
    this.cols = [
      {field: 'code', header: 'Code', type: 'string'},
      {field: 'value', header: 'Value', type: 'number'},
      {field: 'taxRates', header: 'Taxe Rates', type: 'number'},
      {field: 'variableBonusDate', header: 'Variable Bonus Date', type: 'date'},
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
    this.searchSentence = '';
    this.currentOrganization = this.authenticationService.getCurrentOrganization();
    this.searchSentence = 'organization.code:' + this.currentOrganization.code;
    this.subscriptions.add(this.variableBonusService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      },
      error => {
        this.toastr.error(error.message);
      }
    ));
    this.subscriptions.add(this.variableBonusService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.variableBonusList = data;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.toastr.error(error.message);
      },
      () => this.spinner.hide()
    ));
    this.subscriptions.add(this.fiscalYearService.findAll().subscribe(
      (data) => {
        this.fiscalYearList = data;
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
    this.subscriptions.add(this.variableBonusService.findAll().subscribe(
      data => {
        this.variableBonusExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.variableBonusExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.variableBonusExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.variableBonusService.findAll().subscribe(
      data => {
        this.variableBonusExportList = data;
        this.globalService.generatePdf(event, this.variableBonusExportList, this.className, this.listTitle);
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
    // Check the Tax Rates
    if (this.searchTaxRates) {
      this.searchSentence += 'taxRates:' + this.searchTaxRates + ',';
      index = index + 1;
    }
    // Check the VariableBonus Date
    if (this.searchVariableBonusDate) {
      this.searchSentence += 'variableBonusDate:' + this.searchVariableBonusDate + ',';
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

    this.subscriptions.add(this.variableBonusService.find(this.searchSentence).subscribe(
      (data) => {
        this.variableBonusList = data;
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
    this.searchTaxRates = null;
    this.searchVariableBonusDate = null;
    this.searchEmployee = null;

    this.loadData();
  }

  onObjectEdited(event) {
    this.editMode = event.operationMode;
    this.selectedVariableBonuses = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedVariableBonuses[0].code;
      this.updateValue = this.selectedVariableBonuses[0].value;
      this.updateTaxRates = this.selectedVariableBonuses[0].taxRates;
      this.updateVariableBonusDate = this.selectedVariableBonuses[0].variableBonusDate;
      this.updateEmployee = this.selectedVariableBonuses[0].employee;
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.variableBonus = new VariableBonus();
    this.variableBonus.code = this.addCode;
    this.variableBonus.value = this.addValue;
    this.variableBonus.taxRates = this.addTaxRates;
    this.variableBonus.variableBonusDate = this.addVariableBonusDate;
    this.variableBonus.employee = this.addEmployee;
    this.variableBonus.organization = this.currentOrganization;

    this.subscriptions.add(this.variableBonusService.set(this.variableBonus).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.variableBonus = null;
        this.addCode = null;
        this.addValue = null;
        this.addTaxRates = null;
        this.addVariableBonusDate = null;
        this.addEmployee = null;
        this.editMode = null;
        this.selectedVariableBonuses = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.variableBonus = null;
        this.addCode = null;
        this.addValue = null;
        this.addTaxRates = null;
        this.addVariableBonusDate = null;
        this.addEmployee = null;
        this.editMode = null;
        this.selectedVariableBonuses = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.variableBonus = null;
    this.subscriptions.add(this.variableBonusService.findById(this.selectedVariableBonuses[0].id).subscribe(
      (data) => {
        this.variableBonus = data;
        this.variableBonus.code = this.updateCode;
        this.variableBonus.value = this.updateValue;
        this.variableBonus.taxRates = this.updateTaxRates;
        this.variableBonus.variableBonusDate = this.updateVariableBonusDate;
        this.variableBonus.employee = this.updateEmployee;

        if (null !== this.variableBonus) {
          this.subscriptions.add(this.variableBonusService.set(this.variableBonus).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.variableBonus = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateValue = null;
              this.updateTaxRates = null;
              this.updateVariableBonusDate = null;
              this.updateEmployee = null;
              this.selectedVariableBonuses = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.variableBonus = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateValue = null;
              this.updateTaxRates = null;
              this.updateVariableBonusDate = null;
              this.updateEmployee = null;
              this.selectedVariableBonuses = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedVariableBonuses.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected variableBonus?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.variableBonusService.deleteListByIds(ids).subscribe(
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

    for (let i = 0; i < this.fiscalYearList.length; i++) {
      const employee = this.fiscalYearList[i];
      if (employee.code.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(employee);
      }
    }

    this.fiscalYearList = filtered;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
