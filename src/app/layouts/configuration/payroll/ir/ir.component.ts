import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {Ir} from '../../../../shared/models/configuration/payroll/ir';
import {IrService} from '../../../../shared/services/api/configuration/payroll/ir.service';
import {FiscalYear} from '../../../../shared/models/configuration/payroll/fiscal-year';
import {FiscalYearService} from '../../../../shared/services/api/configuration/payroll/fiscal-year.service';
import {Country} from '../../../../shared/models/configuration/country';
import {CountryService} from '../../../../shared/services/api/configuration/country.service';

@Component({
  selector: 'app-ir',
  templateUrl: './ir.component.html',
  styleUrls: ['./ir.component.css']
})
export class IrComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedIrs: Array<Ir> = [];
  loading: boolean;
  irList: Array<Ir> = [];
  className: string;
  cols: any[];
  editMode: number;
  irExportList: Array<Ir> = [];
  listTitle = 'Liste des AMO';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];

  // Drop Down
  fiscalYearList: Array<FiscalYear> = [];
  countryList: Array<Country> = [];

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  ir: Ir;
  ids: Array<number>;
  // Component Attributes // Add
  addStartTrache: number;
  addEndTranche: number;
  addRate: number;
  addAmountDeduct: number;
  addCeiling: boolean;
  addCeilingAmount: number;
  addFiscalYear: FiscalYear;
  addCountry: Country;
  // Component Attributes // Update
  updateStartTrache: number;
  updateEndTranche: number;
  updateRate: number;
  updateAmountDeduct: number;
  updateCeiling: boolean;
  updateCeilingAmount: number;
  updateFiscalYear: FiscalYear;
  updateCountry: Country;
  // Component Attributes // Search
  searchSentence: string;
  searchStartTrache: number;
  searchEndTranche: number;
  searchRate: number;
  searchAmountDeduct: number;
  searchCeiling: boolean;
  searchCeilingAmount: number;
  searchFiscalYear: FiscalYear;
  searchCountry: Country;

  constructor(private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private fiscalYearService: FiscalYearService,
              private countryService: CountryService,
              private globalService: GlobalService,
              private irService: IrService,
              private confirmationService: ConfirmationService,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' Ir'},
      {label: 'Lister', routerLink: '/core/ir'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = Ir.name;
    this.cols = [
      {field: 'startTrache', header: 'Start Trache', type: 'number'},
      {field: 'endTranche', header: 'End Tranche', type: 'number'},
      {field: 'rate', header: 'Rate', type: 'number'},
      {field: 'amountDeduct', header: ' Amount Deduct', type: 'number'},
      {field: 'ceiling', header: 'Ceiling', type: 'boolean'},
      {field: 'ceilingAmount', header: 'Ceiling Amount', type: 'number'},
      {field: 'fiscalYear', child: 'code', header: 'FiscalYear', type: 'object'},
      {field: 'country', child: 'code', header: 'Country', type: 'object'},
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
    this.subscriptions.add(this.irService.size().subscribe(
      data => {
        this.collectionSize = data;
      },
      error => {
        this.toastr.error(error.message);
      }
    ));
    this.subscriptions.add(this.irService.findAllPagination(this.page, this.size).subscribe(
      data => {
        this.irList = data;
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
        this.toastr.error(error.message);
      },
    ));
    this.subscriptions.add(this.countryService.findAll().subscribe(
      data => {
        this.countryList = data;
      },
      error => {
        this.toastr.error(error.message);
      },
    ));
  }

  loadDataLazy(event) {
    this.size = event.rows;
    this.page = event.first / this.size;
    this.loadData();
  }

  onExportExcel(event) {
    this.subscriptions.add(this.irService.findAll().subscribe(
      data => {
        this.irExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.irExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.irExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.irService.findAll().subscribe(
      data => {
        this.irExportList = data;
        this.globalService.generatePdf(event, this.irExportList, this.className, this.listTitle);
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

    // Check the Start Trache
    if (this.searchStartTrache) {
      this.searchSentence += 'startTrache:' + this.searchStartTrache + ',';
      index = index + 1;
    }
    // Check the End Tranche
    if (this.searchEndTranche) {
      this.searchSentence += 'endTranche:' + this.searchEndTranche + ',';
      index = index + 1;
    }
    // Check the Rate
    if (this.searchRate) {
      this.searchSentence += 'rate:' + this.searchRate + ',';
      index = index + 1;
    }
    // Check the Amount Deduct
    if (this.searchAmountDeduct) {
      this.searchSentence += 'amountDeduct:' + this.searchAmountDeduct + ',';
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
    // Check the Country
    if (this.searchCountry) {
      this.searchSentence += 'country.code:' + this.searchCountry.code + ',';
      index = index + 1;
    }

    if (index > 0 && index === 1) {
      this.searchSentence = this.searchSentence.slice(0, -1);
    } else {
      this.searchSentence = '.' + this.searchSentence.slice(0, -1);
    }

    this.subscriptions.add(this.irService.find(this.searchSentence).subscribe(
      (data) => {
        this.irList = data;
      },
      (error) => {
        this.toastr.error(error.message);
      }
    ));
  }

  reset() {
    this.searchSentence = null;

    this.searchStartTrache = null;
    this.searchEndTranche = null;
    this.searchRate = null;
    this.searchAmountDeduct = null;
    this.searchCeiling = null;
    this.searchCeilingAmount = null;
    this.searchFiscalYear = null;
    this.searchCountry = null;

    this.loadData();
  }

  onObjectEdited(event) {
    this.editMode = event.operationMode;
    this.selectedIrs = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateStartTrache = this.selectedIrs[0].startTrache;
      this.updateEndTranche = this.selectedIrs[0].endTranche;
      this.updateRate = this.selectedIrs[0].rate;
      this.updateAmountDeduct = this.selectedIrs[0].amountDeduct;
      this.updateCeiling = this.selectedIrs[0].ceiling;
      this.updateCeilingAmount = this.selectedIrs[0].ceilingAmount;
      this.updateFiscalYear = this.selectedIrs[0].fiscalYear;
      this.updateCountry = this.selectedIrs[0].country;
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.ir = new Ir();
    this.ir.startTrache = this.addStartTrache;
    this.ir.endTranche = this.addEndTranche;
    this.ir.rate = this.addRate;
    this.ir.amountDeduct = this.addAmountDeduct;
    this.ir.ceiling = this.addCeiling;
    this.ir.ceilingAmount = this.addCeilingAmount;
    this.ir.fiscalYear = this.addFiscalYear;
    this.ir.country = this.addCountry;

    this.subscriptions.add(this.irService.set(this.ir).subscribe(
      (data) => {
        this.toastr.success('El??ment est Enregistr?? Avec Succ??s', 'Cr??ation');
        this.ir = null;
        this.addStartTrache = null;
        this.addEndTranche = null;
        this.addRate = null;
        this.addAmountDeduct = null;
        this.addCeiling = null;
        this.addCeilingAmount = null;
        this.addFiscalYear = null;
        this.addCountry = null;
        this.editMode = null;
        this.selectedIrs = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.ir = null;
        this.addStartTrache = null;
        this.addEndTranche = null;
        this.addRate = null;
        this.addAmountDeduct = null;
        this.addCeiling = null;
        this.addCeilingAmount = null;
        this.addFiscalYear = null;
        this.addCountry = null;
        this.editMode = null;
        this.selectedIrs = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.ir = null;
    this.subscriptions.add(this.irService.findById(this.selectedIrs[0].id).subscribe(
      (data) => {
        this.ir = data;
        this.ir.startTrache = this.updateStartTrache;
        this.ir.endTranche = this.updateEndTranche;
        this.ir.rate = this.updateRate;
        this.ir.amountDeduct = this.updateAmountDeduct;
        this.ir.ceiling = this.updateCeiling;
        this.ir.ceilingAmount = this.updateCeilingAmount;
        this.ir.fiscalYear = this.updateFiscalYear;
        this.ir.country = this.updateCountry;

        if (null !== this.ir) {
          this.subscriptions.add(this.irService.set(this.ir).subscribe(
            (data1) => {
              this.toastr.success('El??ment est Enregistr?? Avec Succ??s', 'Edition');
              this.ir = null;
              this.editMode = null;
              this.updateStartTrache = null;
              this.updateEndTranche = null;
              this.updateRate = null;
              this.updateAmountDeduct = null;
              this.updateCeiling = null;
              this.updateCeilingAmount = null;
              this.updateFiscalYear = null;
              this.updateCountry = null;
              this.selectedIrs = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.ir = null;
              this.editMode = null;
              this.updateStartTrache = null;
              this.updateEndTranche = null;
              this.updateRate = null;
              this.updateAmountDeduct = null;
              this.updateCeiling = null;
              this.updateCeilingAmount = null;
              this.updateFiscalYear = null;
              this.updateCountry = null;
              this.selectedIrs = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedIrs.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected ir?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.irService.deleteListByIds(ids).subscribe(
          (data) => {
            this.toastr.success('El??ment Supprimer avec Succ??s', 'Suppression');
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

  filterCountry(event) {
    const filtered: any[] = [];
    const code = event.query;

    if (code) {
      for (let i = 0; i < this.countryList.length; i++) {
        const country = this.countryList[i];
        if (country.code.toLowerCase().indexOf(code.toLowerCase()) === 0) {
          filtered.push(country);
        }
      }
      this.countryList = filtered;
    } else {
      this.subscriptions.add(this.countryService.findAll().subscribe(
        (data) => {
          this.countryList = data;
        },
        (error) => {
          this.toastr.error(error.message);
        },
      ));
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
