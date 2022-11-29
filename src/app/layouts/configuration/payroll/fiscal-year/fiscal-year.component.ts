import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FiscalYear} from '../../../../shared/models/configuration/payroll/fiscal-year';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {Organization} from '../../../../shared/models/configuration/organization';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthenticationService} from '../../../../shared/services/api/authentication.service';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {FiscalYearService} from '../../../../shared/services/api/configuration/payroll/fiscal-year.service';

@Component({
  selector: 'app-fiscal-year',
  templateUrl: './fiscal-year.component.html',
  styleUrls: ['./fiscal-year.component.css']
})
export class FiscalYearComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedFiscalYears: Array<FiscalYear> = [];
  loading: boolean;
  fiscalYearList: Array<FiscalYear> = [];
  className: string;
  cols: any[];
  editMode: number;
  fiscalYearExportList: Array<FiscalYear> = [];
  listTitle = 'Liste des fiscal years';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  fiscalYear: FiscalYear;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  // Component Attributes // Update
  updateCode: string;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;

  constructor(private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private authenticationService: AuthenticationService,
    private globalService: GlobalService,
    private fiscalYearService: FiscalYearService,
    private confirmationService: ConfirmationService,
  @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' FiscalYear'},
      {label: 'Lister', routerLink: '/core/fiscalYear'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = FiscalYear.name;
    this.cols = [
      {field: 'code', header: 'Code', type: 'string'},
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

    this.subscriptions.add(this.fiscalYearService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      },
      error => {
        this.toastr.error(error.message);
      }
    ));
    this.subscriptions.add(this.fiscalYearService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.fiscalYearList = data;
        this.spinner.hide();
      },
      error => {
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
    this.subscriptions.add(this.fiscalYearService.findAll().subscribe(
      data => {
        this.fiscalYearExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.fiscalYearExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.fiscalYearExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.fiscalYearService.findAll().subscribe(
      data => {
        this.fiscalYearExportList = data;
        this.globalService.generatePdf(event, this.fiscalYearExportList, this.className, this.listTitle);
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
    this.searchSentence = '.';
    this.searchSentence += 'code:' + this.searchCode + ',';
    this.searchSentence += 'organization.code:' + this.currentOrganization.code;

    this.subscriptions.add(this.fiscalYearService.find(this.searchSentence).subscribe(
      (data) => {
        this.fiscalYearList = data;
      },
      (error) => {
        this.toastr.error(error.message);
      }
    ));
  }

  reset() {
    this.searchSentence = null;
    this.searchCode = null;

    this.loadData();
  }

  onObjectEdited(event) {
    this.editMode = event.operationMode;
    this.selectedFiscalYears = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedFiscalYears[0].code.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.fiscalYear = new FiscalYear();
    this.fiscalYear.code = this.addCode;
    this.fiscalYear.organization = this.currentOrganization;
    this.subscriptions.add(this.fiscalYearService.set(this.fiscalYear).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.fiscalYear = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedFiscalYears = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.fiscalYear = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedFiscalYears = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.fiscalYear = null;
    this.subscriptions.add(this.fiscalYearService.find('code:' + this.selectedFiscalYears[0].code).subscribe(
      (data) => {
        this.fiscalYear = data.length !== 1 ? null : data[0];
        this.fiscalYear.code = this.updateCode;

        if (null !== this.fiscalYear) {
          this.subscriptions.add(this.fiscalYearService.set(this.fiscalYear).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.fiscalYear = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedFiscalYears = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.fiscalYear = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedFiscalYears = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedFiscalYears.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected fiscalYear?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.fiscalYearService.deleteListByIds(ids).subscribe(
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
