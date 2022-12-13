import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {MutualInsuranceService} from '../../../../shared/services/api/configuration/payroll/mutual-insurance.service';
import {MutualInsurance} from '../../../../shared/models/configuration/payroll/mutual-insurance';
import {FiscalYear} from '../../../../shared/models/configuration/payroll/fiscal-year';
import {FiscalYearService} from '../../../../shared/services/api/configuration/payroll/fiscal-year.service';
import {Country} from '../../../../shared/models/configuration/country';
import {CountryService} from '../../../../shared/services/api/configuration/country.service';

@Component({
  selector: 'app-mutual-insurance',
  templateUrl: './mutual-insurance.component.html',
  styleUrls: ['./mutual-insurance.component.css']
})
export class MutualInsuranceComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedMutualInsurances: Array<MutualInsurance> = [];
  loading: boolean;
  mutualInsuranceList: Array<MutualInsurance> = [];
  className: string;
  cols: any[];
  editMode: number;
  mutualInsuranceExportList: Array<MutualInsurance> = [];
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
  mutualInsurance: MutualInsurance;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: String;
  addSalaryRate: number;
  addEmployerRate: number;
  addCeiling: boolean;
  addCeilingAmount: number;
  addFiscalYear: FiscalYear;
  addCountry: Country;
  // Component Attributes // Update
  updateCode: String;
  updateSalaryRate: number;
  updateEmployerRate: number;
  updateCeiling: boolean;
  updateCeilingAmount: number;
  updateFiscalYear: FiscalYear;
  updateCountry: Country;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: String;
  searchSalaryRate: number;
  searchEmployerRate: number;
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
              private mutualInsuranceService: MutualInsuranceService,
              private confirmationService: ConfirmationService,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' MutualInsurance'},
      {label: 'Lister', routerLink: '/core/mutualInsurance'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = MutualInsurance.name;
    this.cols = [
      {field: 'code', header: 'Code', type: 'string'},
      {field: 'salaryRate', header: 'Salary Rate', type: 'number'},
      {field: 'employerRate', header: 'Employer Rate', type: 'number'},
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
    this.subscriptions.add(this.mutualInsuranceService.size().subscribe(
      data => {
        this.collectionSize = data;
      },
      error => {
        this.toastr.error(error.message);
      }
    ));
    this.subscriptions.add(this.mutualInsuranceService.findAllPagination(this.page, this.size).subscribe(
      data => {
        this.mutualInsuranceList = data;
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
    this.subscriptions.add(this.mutualInsuranceService.findAll().subscribe(
      data => {
        this.mutualInsuranceExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.mutualInsuranceExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.mutualInsuranceExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.mutualInsuranceService.findAll().subscribe(
      data => {
        this.mutualInsuranceExportList = data;
        this.globalService.generatePdf(event, this.mutualInsuranceExportList, this.className, this.listTitle);
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

    this.subscriptions.add(this.mutualInsuranceService.find(this.searchSentence).subscribe(
      (data) => {
        this.mutualInsuranceList = data;
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
    this.searchCountry = null;

    this.loadData();
  }

  onObjectEdited(event) {
    this.editMode = event.operationMode;
    this.selectedMutualInsurances = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedMutualInsurances[0].code;
      this.updateSalaryRate = this.selectedMutualInsurances[0].salaryRate;
      this.updateEmployerRate = this.selectedMutualInsurances[0].employerRate;
      this.updateCeiling = this.selectedMutualInsurances[0].ceiling;
      this.updateCeilingAmount = this.selectedMutualInsurances[0].ceilingAmount;
      this.updateFiscalYear = this.selectedMutualInsurances[0].fiscalYear;
      this.updateCountry = this.selectedMutualInsurances[0].country;
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.mutualInsurance = new MutualInsurance();
    this.mutualInsurance.code = this.addCode;
    this.mutualInsurance.salaryRate = this.addSalaryRate;
    this.mutualInsurance.employerRate = this.addEmployerRate;
    this.mutualInsurance.ceiling = this.addCeiling;
    this.mutualInsurance.ceilingAmount = this.addCeilingAmount;
    this.mutualInsurance.fiscalYear = this.addFiscalYear;
    this.mutualInsurance.country = this.addCountry;

    this.subscriptions.add(this.mutualInsuranceService.set(this.mutualInsurance).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.mutualInsurance = null;
        this.addCode = null;
        this.addSalaryRate = null;
        this.addEmployerRate = null;
        this.addCeiling = null;
        this.addCeilingAmount = null;
        this.addFiscalYear = null;
        this.addCountry = null;
        this.editMode = null;
        this.selectedMutualInsurances = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.mutualInsurance = null;
        this.addCode = null;
        this.addSalaryRate = null;
        this.addEmployerRate = null;
        this.addCeiling = null;
        this.addCeilingAmount = null;
        this.addFiscalYear = null;
        this.addCountry = null;
        this.editMode = null;
        this.selectedMutualInsurances = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.mutualInsurance = null;
    this.subscriptions.add(this.mutualInsuranceService.findById(this.selectedMutualInsurances[0].id).subscribe(
      (data) => {
        this.mutualInsurance = data;
        this.mutualInsurance.code = this.updateCode;
        this.mutualInsurance.salaryRate = this.updateSalaryRate;
        this.mutualInsurance.employerRate = this.updateEmployerRate;
        this.mutualInsurance.ceiling = this.updateCeiling;
        this.mutualInsurance.ceilingAmount = this.updateCeilingAmount;
        this.mutualInsurance.fiscalYear = this.updateFiscalYear;
        this.mutualInsurance.country = this.updateCountry;

        if (null !== this.mutualInsurance) {
          this.subscriptions.add(this.mutualInsuranceService.set(this.mutualInsurance).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.mutualInsurance = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateSalaryRate = null;
              this.updateEmployerRate = null;
              this.updateCeiling = null;
              this.updateCeilingAmount = null;
              this.updateFiscalYear = null;
              this.updateCountry = null;
              this.selectedMutualInsurances = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.mutualInsurance = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateSalaryRate = null;
              this.updateEmployerRate = null;
              this.updateCeiling = null;
              this.updateCeilingAmount = null;
              this.updateFiscalYear = null;
              this.updateCountry = null;
              this.selectedMutualInsurances = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedMutualInsurances.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected mutualInsurance?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.mutualInsuranceService.deleteListByIds(ids).subscribe(
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
