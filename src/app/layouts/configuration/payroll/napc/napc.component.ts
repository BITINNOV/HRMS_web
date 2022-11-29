import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {Organization} from '../../../../shared/models/configuration/organization';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthenticationService} from '../../../../shared/services/api/authentication.service';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {Napc} from '../../../../shared/models/configuration/payroll/napc';
import {NapcService} from '../../../../shared/services/api/configuration/payroll/napc.service';
import {FiscalYear} from '../../../../shared/models/configuration/payroll/fiscal-year';
import {FiscalYearService} from '../../../../shared/services/api/configuration/payroll/fiscal-year.service';

@Component({
  selector: 'app-napc',
  templateUrl: './napc.component.html',
  styleUrls: ['./napc.component.css']
})
export class NapcComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedNapcs: Array<Napc> = [];
  loading: boolean;
  napcList: Array<Napc> = [];
  className: string;
  cols: any[];
  editMode: number;
  napcExportList: Array<Napc> = [];
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
  napc: Napc;
  ids: Array<number>;
  // Component Attributes // Add
  addCeiling: boolean;
  addCeilingAmount: number;
  addRequirement: string;
  addFiscalYear: FiscalYear;
  // Component Attributes // Update
  updateCeiling: boolean;
  updateCeilingAmount: number;
  updateRequirement: string;
  updateFiscalYear: FiscalYear;
  // Component Attributes // Search
  searchSentence: string;
  searchCeiling: boolean;
  searchCeilingAmount: number;
  searchRequirement: string;
  searchFiscalYear: FiscalYear;

  constructor(private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private fiscalYearService: FiscalYearService,
              private globalService: GlobalService,
              private napcService: NapcService,
              private confirmationService: ConfirmationService,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' Napc'},
      {label: 'Lister', routerLink: '/core/napc'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = Napc.name;
    this.cols = [
      {field: 'ceiling', header: 'Ceiling', type: 'boolean'},
      {field: 'ceilingAmount', header: ' Ceiling Amount', type: 'number'},
      {field: 'requirement', header: 'Requirement', type: 'string'},
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
    this.subscriptions.add(this.napcService.size().subscribe(
      data => {
        this.collectionSize = data;
      },
      error => {
        this.toastr.error(error.message);
      }
    ));
    this.subscriptions.add(this.napcService.findAllPagination(this.page, this.size).subscribe(
      data => {
        this.napcList = data;
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
    this.subscriptions.add(this.napcService.findAll().subscribe(
      data => {
        this.napcExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.napcExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.napcExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.napcService.findAll().subscribe(
      data => {
        this.napcExportList = data;
        this.globalService.generatePdf(event, this.napcExportList, this.className, this.listTitle);
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
    // Check the Requirement
    if (this.searchRequirement) {
      this.searchSentence += 'requirement:' + this.searchRequirement + ',';
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

    this.subscriptions.add(this.napcService.find(this.searchSentence).subscribe(
      (data) => {
        this.napcList = data;
      },
      (error) => {
        this.toastr.error(error.message);
      }
    ));
  }

  reset() {
    this.searchSentence = null;

    this.searchCeiling = null;
    this.searchCeilingAmount = null;
    this.searchRequirement = null;
    this.searchFiscalYear = null;

    this.loadData();
  }

  onObjectEdited(event) {
    this.editMode = event.operationMode;
    this.selectedNapcs = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCeiling = this.selectedNapcs[0].ceiling;
      this.updateCeilingAmount = this.selectedNapcs[0].ceilingAmount;
      this.updateRequirement = this.selectedNapcs[0].requirement;
      this.updateFiscalYear = this.selectedNapcs[0].fiscalYear;
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.napc = new Napc();
    this.napc.ceiling = this.addCeiling;
    this.napc.ceilingAmount = this.addCeilingAmount;
    this.napc.requirement = this.addRequirement;
    this.napc.fiscalYear = this.addFiscalYear;

    this.subscriptions.add(this.napcService.set(this.napc).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.napc = null;
        this.addCeiling = null;
        this.addCeilingAmount = null;
        this.addFiscalYear = null;
        this.addFiscalYear = null;
        this.editMode = null;
        this.selectedNapcs = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.napc = null;
        this.addCeiling = null;
        this.addCeilingAmount = null;
        this.addFiscalYear = null;
        this.addFiscalYear = null;
        this.editMode = null;
        this.selectedNapcs = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.napc = null;
    this.subscriptions.add(this.napcService.findById(this.selectedNapcs[0].id).subscribe(
      (data) => {
        this.napc = data;
        this.napc.ceiling = this.updateCeiling;
        this.napc.ceilingAmount = this.updateCeilingAmount;
        this.napc.requirement = this.updateRequirement;
        this.napc.fiscalYear = this.updateFiscalYear;

        if (null !== this.napc) {
          this.subscriptions.add(this.napcService.set(this.napc).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.napc = null;
              this.editMode = null;
              this.updateCeiling = null;
              this.updateCeilingAmount = null;
              this.updateRequirement = null;
              this.updateFiscalYear = null;
              this.selectedNapcs = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.napc = null;
              this.editMode = null;
              this.updateCeiling = null;
              this.updateCeilingAmount = null;
              this.updateRequirement = null;
              this.updateFiscalYear = null;
              this.selectedNapcs = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedNapcs.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected napc?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.napcService.deleteListByIds(ids).subscribe(
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
