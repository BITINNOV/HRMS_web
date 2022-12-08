import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {Cnss} from '../../../../shared/models/configuration/payroll/cnss';
import {CnssService} from '../../../../shared/services/api/configuration/payroll/cnss.service';
import {FiscalYear} from '../../../../shared/models/configuration/payroll/fiscal-year';
import {FiscalYearService} from '../../../../shared/services/api/configuration/payroll/fiscal-year.service';

@Component({
  selector: 'app-cnss',
  templateUrl: './cnss.component.html',
  styleUrls: ['./cnss.component.css']
})
export class CnssComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedCnsss: Array<Cnss> = [];
  loading: boolean;
  cnssList: Array<Cnss> = [];
  className: string;
  cols: any[];
  editMode: number;
  cnssExportList: Array<Cnss> = [];
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
  cnss: Cnss;
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
              private cnssService: CnssService,
              private confirmationService: ConfirmationService,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' Cnss'},
      {label: 'Lister', routerLink: '/core/cnss'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = Cnss.name;
    this.cols = [
      {field: 'code', header: 'Code', type: 'string'},
      {field: 'salaryRate', header: 'Salary Rate', type: 'number'},
      {field: 'employerRate', header: 'Employer Rate', type: 'number'},
      {field: 'ceiling', header: 'Ceiling', type: 'boolean'},
      {field: 'ceilingAmount', header: ' Cnssunt', type: 'number'},
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
    this.subscriptions.add(this.cnssService.size().subscribe(
      data => {
        this.collectionSize = data;
      },
      error => {
        this.toastr.error(error.message);
      }
    ));
    this.subscriptions.add(this.cnssService.findAllPagination(this.page, this.size).subscribe(
      data => {
        this.cnssList = data;
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
    this.subscriptions.add(this.cnssService.findAll().subscribe(
      data => {
        this.cnssExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.cnssExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.cnssExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.cnssService.findAll().subscribe(
      data => {
        this.cnssExportList = data;
        this.globalService.generatePdf(event, this.cnssExportList, this.className, this.listTitle);
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
    // Check the Ceiling Cnssunt
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

    this.subscriptions.add(this.cnssService.find(this.searchSentence).subscribe(
      (data) => {
        this.cnssList = data;
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
    this.selectedCnsss = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedCnsss[0].code;
      this.updateSalaryRate = this.selectedCnsss[0].salaryRate;
      this.updateEmployerRate = this.selectedCnsss[0].employerRate;
      this.updateCeiling = this.selectedCnsss[0].ceiling;
      this.updateCeilingAmount = this.selectedCnsss[0].ceilingAmount;
      this.updateFiscalYear = this.selectedCnsss[0].fiscalYear;
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.cnss = new Cnss();
    this.cnss.code = this.addCode;
    this.cnss.salaryRate = this.addSalaryRate;
    this.cnss.employerRate = this.addEmployerRate;
    this.cnss.ceiling = this.addCeiling;
    this.cnss.ceilingAmount = this.addCeilingAmount;
    this.cnss.fiscalYear = this.addFiscalYear;

    this.subscriptions.add(this.cnssService.set(this.cnss).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.cnss = null;
        this.addCode = null;
        this.addSalaryRate = null;
        this.addEmployerRate = null;
        this.addCeiling = null;
        this.addCeilingAmount = null;
        this.addFiscalYear = null;
        this.editMode = null;
        this.selectedCnsss = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.cnss = null;
        this.addCode = null;
        this.addSalaryRate = null;
        this.addEmployerRate = null;
        this.addCeiling = null;
        this.addCeilingAmount = null;
        this.addFiscalYear = null;
        this.editMode = null;
        this.selectedCnsss = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.cnss = null;
    this.subscriptions.add(this.cnssService.findById(this.selectedCnsss[0].id).subscribe(
      (data) => {
        this.cnss = data;
        this.cnss.code = this.updateCode;
        this.cnss.salaryRate = this.updateSalaryRate;
        this.cnss.employerRate = this.updateEmployerRate;
        this.cnss.ceiling = this.updateCeiling;
        this.cnss.ceilingAmount = this.updateCeilingAmount;
        this.cnss.fiscalYear = this.updateFiscalYear;

        if (null !== this.cnss) {
          this.subscriptions.add(this.cnssService.set(this.cnss).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.cnss = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateSalaryRate = null;
              this.updateEmployerRate = null;
              this.updateCeiling = null;
              this.updateCeilingAmount = null;
              this.updateFiscalYear = null;
              this.selectedCnsss = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.cnss = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateSalaryRate = null;
              this.updateEmployerRate = null;
              this.updateCeiling = null;
              this.updateCeilingAmount = null;
              this.updateFiscalYear = null;
              this.selectedCnsss = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedCnsss.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected cnss?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.cnssService.deleteListByIds(ids).subscribe(
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
