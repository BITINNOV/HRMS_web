import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Amo} from '../../../../shared/models/configuration/payroll/amo';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {Organization} from '../../../../shared/models/configuration/organization';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthenticationService} from '../../../../shared/services/api/authentication.service';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {AmoService} from '../../../../shared/services/api/configuration/payroll/amo.service';
import {FiscalYear} from '../../../../shared/models/configuration/payroll/fiscal-year';
import {FiscalYearService} from '../../../../shared/services/api/configuration/payroll/fiscal-year.service';

@Component({
  selector: 'app-amo',
  templateUrl: './amo.component.html',
  styleUrls: ['./amo.component.css']
})
export class AmoComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedAmos: Array<Amo> = [];
  loading: boolean;
  amoList: Array<Amo> = [];
  className: string;
  cols: any[];
  editMode: number;
  amoExportList: Array<Amo> = [];
  listTitle = 'Liste des AMO';
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
  amo: Amo;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: String;
  addSalaryRate: number;
  addEmployerRate: number;
  addCeiling: boolean;
  addCeilingAmount: number;
  addFiscalYear: FiscalYear;
  // Component Attributes // Update
  updateCode: String;
  updateSalaryRate: number;
  updateEmployerRate: number;
  updateCeiling: boolean;
  updateCeilingAmount: number;
  updateFiscalYear: FiscalYear;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: String;
  searchSalaryRate: number;
  searchEmployerRate: number;
  searchCeiling: boolean;
  searchCeilingAmount: number;
  searchFiscalYear: FiscalYear;

  constructor(private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private fiscalYearService: FiscalYearService,
              private globalService: GlobalService,
              private amoService: AmoService,
              private confirmationService: ConfirmationService,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' Amo'},
      {label: 'Lister', routerLink: '/core/amo'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = Amo.name;
    this.cols = [
      {field: 'code', header: 'Code', type: 'string'},
      {field: 'salaryRate', header: 'Salary Rate', type: 'number'},
      {field: 'employerRate', header: 'Employer Rate', type: 'number'},
      {field: 'ceiling', header: 'Ceiling', type: 'boolean'},
      {field: 'ceilingAmount', header: ' Amount', type: 'number'},
      {field: 'fiscalYear', child: 'code', header: 'FiscalYear', type: 'object'},
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
    this.subscriptions.add(this.amoService.size().subscribe(
      data => {
        this.collectionSize = data;
      },
      error => {
        this.toastr.error(error.message);
      }
    ));
    this.subscriptions.add(this.amoService.findAllPagination(this.page, this.size).subscribe(
      data => {
        this.amoList = data;
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
    this.subscriptions.add(this.amoService.findAll().subscribe(
      data => {
        this.amoExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.amoExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.amoExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.amoService.findAll().subscribe(
      data => {
        this.amoExportList = data;
        this.globalService.generatePdf(event, this.amoExportList, this.className, this.listTitle);
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
    // Check the Salary Rate
    if (this.searchSalaryRate) {
      this.searchSentence += 'salaryRate:' + this.searchSalaryRate + ',';
      index = index + 1;
    }
    // Check the Employer Rate
    if (this.searchEmployerRate) {
      this.searchSentence += 'employerRate:' + this.searchEmployerRate + ',';
      index = index + 1;
    }
    // Check the Ceiling
    if (this.searchCeiling) {
      this.searchSentence += 'ceiling:' + this.searchCeiling + ',';
      index = index + 1;
    }
    // Check the Ceiling Amount
    if (this.searchCeilingAmount) {
      this.searchSentence += 'ceilingAmount:' + this.searchCeilingAmount + ',';
      index = index + 1;
    }
    // Check the Fiscal Year
    if (this.searchFiscalYear) {
      this.searchSentence += 'fiscalYear.code:' + this.searchFiscalYear.code + ',';
      index = index + 1;
    }
    if (index > 0 && index === 1) {
      this.searchSentence = this.searchSentence.slice(0, -1);
    } else {
      this.searchSentence = '.' + this.searchSentence.slice(0, -1);
    }

    this.subscriptions.add(this.amoService.find(this.searchSentence).subscribe(
      (data) => {
        this.amoList = data;
      },
      (error) => {
        this.toastr.error(error.message);
      }
    ));
  }

  reset() {
    this.searchSentence = null;

    this.searchCode = null;
    this.searchSalaryRate = null;
    this.searchEmployerRate = null;
    this.searchCeiling = null;
    this.searchCeilingAmount = null;
    this.searchFiscalYear = null;

    this.loadData();
  }

  onObjectEdited(event) {
    this.editMode = event.operationMode;
    this.selectedAmos = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedAmos[0].code;
      this.updateSalaryRate = this.selectedAmos[0].salaryRate;
      this.updateEmployerRate = this.selectedAmos[0].employerRate;
      this.updateCeiling = this.selectedAmos[0].ceiling;
      this.updateCeilingAmount = this.selectedAmos[0].ceilingAmount;
      this.updateFiscalYear = this.selectedAmos[0].fiscalYear;
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.amo = new Amo();
    this.amo.code = this.addCode;
    this.amo.salaryRate = this.addSalaryRate;
    this.amo.employerRate = this.addEmployerRate;
    this.amo.ceiling = this.addCeiling;
    this.amo.ceilingAmount = this.addCeilingAmount;
    this.amo.fiscalYear = this.addFiscalYear;

    this.subscriptions.add(this.amoService.set(this.amo).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.amo = null;
        this.addCode = null;
        this.addSalaryRate = null;
        this.addEmployerRate = null;
        this.addCeiling = null;
        this.addCeilingAmount = null;
        this.addFiscalYear = null;
        this.editMode = null;
        this.selectedAmos = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.amo = null;
        this.addCode = null;
        this.addSalaryRate = null;
        this.addEmployerRate = null;
        this.addCeiling = null;
        this.addCeilingAmount = null;
        this.addFiscalYear = null;
        this.editMode = null;
        this.selectedAmos = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.amo = null;
    this.subscriptions.add(this.amoService.findById(this.selectedAmos[0].id).subscribe(
      (data) => {
        this.amo = data;
        this.amo.code = this.updateCode;
        this.amo.salaryRate = this.updateSalaryRate;
        this.amo.employerRate = this.updateEmployerRate;
        this.amo.ceiling = this.updateCeiling;
        this.amo.ceilingAmount = this.updateCeilingAmount;
        this.amo.fiscalYear = this.updateFiscalYear;

        if (null !== this.amo) {
          this.subscriptions.add(this.amoService.set(this.amo).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.amo = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateSalaryRate = null;
              this.updateEmployerRate = null;
              this.updateCeiling = null;
              this.updateCeilingAmount = null;
              this.updateFiscalYear = null;
              this.selectedAmos = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.amo = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateSalaryRate = null;
              this.updateEmployerRate = null;
              this.updateCeiling = null;
              this.updateCeilingAmount = null;
              this.updateFiscalYear = null;
              this.selectedAmos = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedAmos.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected amo?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.amoService.deleteListByIds(ids).subscribe(
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

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
