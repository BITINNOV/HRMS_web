import {ToastrService} from 'ngx-toastr';
import {GlobalService} from '../../../shared/services/api/global.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {Subscription} from 'rxjs';
import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {Country} from '../../../shared/models/configuration/country';
import {CountryService} from '../../../shared/services/api/configuration/country.service';
import {AuthenticationService} from '../../../shared/services/api/authentication.service';
import {Organization} from '../../../shared/models/configuration/organization';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})

export class CountryComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedCountries: Array<Country> = [];
  loading: boolean;
  countryList: Array<Country> = [];
  className: string;
  cols: any[];
  editMode: number;
  countryExportList: Array<Country> = [];
  listTitle = 'Liste des countries';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  country: Country;
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
              private countryService: CountryService,
              private confirmationService: ConfirmationService,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' Country'},
      {label: 'Lister', routerLink: '/core/country'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = Country.name;
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
    this.subscriptions.add(this.countryService.size().subscribe(
      data => {
        this.collectionSize = data;
      },
      error => {
        this.toastr.error(error.message);
      }
    ));
    this.subscriptions.add(this.countryService.findAllPagination(this.page, this.size).subscribe(
      data => {
        this.countryList = data;
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
    this.subscriptions.add(this.countryService.findAll().subscribe(
      data => {
        this.countryExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.countryExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.countryExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.countryService.findAll().subscribe(
      data => {
        this.countryExportList = data;
        this.globalService.generatePdf(event, this.countryExportList, this.className, this.listTitle);
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

    this.subscriptions.add(this.countryService.find(this.searchSentence).subscribe(
      (data) => {
        this.countryList = data;
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
    this.selectedCountries = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedCountries[0].code.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.country = new Country();
    this.country.code = this.addCode;
    this.subscriptions.add(this.countryService.set(this.country).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.country = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedCountries = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.country = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedCountries = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.country = null;
    this.subscriptions.add(this.countryService.find('code:' + this.selectedCountries[0].code).subscribe(
      (data) => {
        this.country = data.length !== 1 ? null : data[0];
        this.country.code = this.updateCode;

        if (null !== this.country) {
          this.subscriptions.add(this.countryService.set(this.country).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.country = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedCountries = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.country = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedCountries = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedCountries.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected country?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.countryService.deleteListByIds(ids).subscribe(
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
