import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FixedBonus} from '../../../shared/models/payroll/fixed-bonus';
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
import {FixedBonusService} from '../../../shared/services/api/payroll/fixed-bonus.service';

@Component({
  selector: 'app-fixed-bonus',
  templateUrl: './fixed-bonus.component.html',
  styleUrls: ['./fixed-bonus.component.css']
})
export class FixedBonusComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedFixedBonuses: Array<FixedBonus> = [];
  loading: boolean;
  fixedBonusList: Array<FixedBonus> = [];
  className: string;
  cols: any[];
  editMode: number;
  fixedBonusExportList: Array<FixedBonus> = [];
  listTitle = 'Liste des FixedBonuses';
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
  fixedBonus: FixedBonus;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: String;
  addValue: number;
  addTaxRates: number;
  addFixedBonusDate: Date;
  // Component Attributes // Update
  updateCode: String;
  updateValue: number;
  updateTaxRates: number;
  updateFixedBonusDate: Date;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: String;
  searchValue: number;
  searchTaxRates: number;
  searchFixedBonusDate: Date;

  constructor(private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private authenticationService: AuthenticationService,
              private fiscalYearService: FiscalYearService,
              private globalService: GlobalService,
              private fixedBonusService: FixedBonusService,
              private confirmationService: ConfirmationService,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' FixedBonus'},
      {label: 'Lister', routerLink: '/core/fixedBonus'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = FixedBonus.name;
    this.cols = [
      {field: 'code', header: 'Code', type: 'string'},
      {field: 'value', header: 'Value', type: 'number'},
      {field: 'taxRates', header: 'Taxe Rates', type: 'number'},
      {field: 'bonusDate', header: 'Fixed Bonus Date', type: 'date'},
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
    this.subscriptions.add(this.fixedBonusService.size().subscribe(
      data => {
        this.collectionSize = data;
      },
      error => {
        this.toastr.error(error.message);
      }
    ));
    this.subscriptions.add(this.fixedBonusService.findAllPagination(this.page, this.size).subscribe(
      data => {
        this.fixedBonusList = data;
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
    this.subscriptions.add(this.fixedBonusService.findAll().subscribe(
      data => {
        this.fixedBonusExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.fixedBonusExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.fixedBonusExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.fixedBonusService.findAll().subscribe(
      data => {
        this.fixedBonusExportList = data;
        this.globalService.generatePdf(event, this.fixedBonusExportList, this.className, this.listTitle);
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
    // Check the FixedBonus Date
    if (this.searchFixedBonusDate) {
      this.searchSentence += 'fixedBonusDate:' + this.searchFixedBonusDate + ',';
      index = index + 1;
    }
    if (index > 0 && index === 1) {
      this.searchSentence = this.searchSentence.slice(0, -1);
    } else {
      this.searchSentence = '.' + this.searchSentence.slice(0, -1);
    }

    this.subscriptions.add(this.fixedBonusService.find(this.searchSentence).subscribe(
      (data) => {
        this.fixedBonusList = data;
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
    this.searchFixedBonusDate = null;

    this.loadData();
  }

  onObjectEdited(event) {
    this.editMode = event.operationMode;
    this.selectedFixedBonuses = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedFixedBonuses[0].code;
      this.updateValue = this.selectedFixedBonuses[0].value;
      this.updateTaxRates = this.selectedFixedBonuses[0].taxRates;
      this.updateFixedBonusDate = this.selectedFixedBonuses[0].bonusDate;
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.fixedBonus = new FixedBonus();
    this.fixedBonus.code = this.addCode;
    this.fixedBonus.value = this.addValue;
    this.fixedBonus.taxRates = this.addTaxRates;
    this.fixedBonus.bonusDate = this.addFixedBonusDate;
    this.fixedBonus.organization = this.currentOrganization;

    this.subscriptions.add(this.fixedBonusService.set(this.fixedBonus).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.fixedBonus = null;
        this.addCode = null;
        this.addValue = null;
        this.addTaxRates = null;
        this.addFixedBonusDate = null;
        this.editMode = null;
        this.selectedFixedBonuses = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.fixedBonus = null;
        this.addCode = null;
        this.addValue = null;
        this.addTaxRates = null;
        this.addFixedBonusDate = null;
        this.editMode = null;
        this.selectedFixedBonuses = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.fixedBonus = null;
    this.subscriptions.add(this.fixedBonusService.findById(this.selectedFixedBonuses[0].id).subscribe(
      (data) => {
        this.fixedBonus = data;
        this.fixedBonus.code = this.updateCode;
        this.fixedBonus.value = this.updateValue;
        this.fixedBonus.taxRates = this.updateTaxRates;
        this.fixedBonus.bonusDate = this.updateFixedBonusDate;

        if (null !== this.fixedBonus) {
          this.subscriptions.add(this.fixedBonusService.set(this.fixedBonus).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.fixedBonus = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateValue = null;
              this.updateTaxRates = null;
              this.updateFixedBonusDate = null;
              this.selectedFixedBonuses = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.fixedBonus = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateValue = null;
              this.updateTaxRates = null;
              this.updateFixedBonusDate = null;
              this.selectedFixedBonuses = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedFixedBonuses.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected fixedBonus?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.fixedBonusService.deleteListByIds(ids).subscribe(
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
