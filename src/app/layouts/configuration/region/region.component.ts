import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Region} from '../../../shared/models/configuration/region';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {Organization} from '../../../shared/models/configuration/organization';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthenticationService} from '../../../shared/services/api/authentication.service';
import {GlobalService} from '../../../shared/services/api/global.service';
import {RegionService} from '../../../shared/services/api/configuration/region.service';
import {Country} from '../../../shared/models/configuration/country';
import {CountryService} from '../../../shared/services/api/configuration/country.service';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css']
})
export class RegionComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedRegions: Array<Region> = [];
  loading: boolean;
  regionList: Array<Region> = [];
  className: string;
  cols: any[];
  editMode: number;
  regionExportList: Array<Region> = [];
  listTitle = 'Liste des regions';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];

  // Drop Down
  countryList: Array<Country> = [];

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  region: Region;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  addCountry: Country;
  // Component Attributes // Update
  updateCode: string;
  updateCountry: Country;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;
  searchCountry: Country;

  constructor(private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private authenticationService: AuthenticationService,
              private countrySrevice: CountryService,
              private globalService: GlobalService,
              private regionService: RegionService,
              private confirmationService: ConfirmationService,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' Region'},
      {label: 'Lister', routerLink: '/core/region'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = Region.name;
    this.cols = [
      {field: 'code', header: 'Code', type: 'string'},
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
    this.searchSentence = '';
    this.currentOrganization = this.authenticationService.getCurrentOrganization();
    this.searchSentence = 'organization.code:' + this.currentOrganization.code;
    this.subscriptions.add(this.regionService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      },
      error => {
        this.toastr.error(error.message);
      }
    ));
    this.subscriptions.add(this.regionService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.regionList = data;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.toastr.error(error.message);
      },
      () => this.spinner.hide()
    ));
    this.subscriptions.add(this.countrySrevice.findAll().subscribe(
      (data) => {
        this.countryList = data;
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
    this.subscriptions.add(this.regionService.findAll().subscribe(
      data => {
        this.regionExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.regionExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.regionExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.regionService.findAll().subscribe(
      data => {
        this.regionExportList = data;
        this.globalService.generatePdf(event, this.regionExportList, this.className, this.listTitle);
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
    if (this.searchCode) {
      this.searchSentence += 'code:' + this.searchCode + ',';
    }
    if (this.searchCountry) {
      this.searchSentence += 'country.code:' + this.searchCountry.code + ',';
    }
    this.searchSentence += 'organization.code:' + this.currentOrganization.code + ',';

    this.subscriptions.add(this.regionService.find(this.searchSentence).subscribe(
      (data) => {
        this.regionList = data;
      },
      (error) => {
        this.toastr.error(error.message);
      }
    ));
  }

  reset() {
    this.searchSentence = null;
    this.searchCountry = null;
    this.searchCode = null;

    this.loadData();
  }

  onObjectEdited(event) {
    this.editMode = event.operationMode;
    this.selectedRegions = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedRegions[0].code.toString();
      this.updateCountry = this.selectedRegions[0].country;
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.region = new Region();
    this.region.code = this.addCode;
    this.region.country = this.addCountry;
    this.region.organization = this.currentOrganization;
    this.subscriptions.add(this.regionService.set(this.region).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.region = null;
        this.addCode = null;
        this.addCountry = null;
        this.editMode = null;
        this.selectedRegions = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.region = null;
        this.addCode = null;
        this.addCountry = null;
        this.editMode = null;
        this.selectedRegions = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.region = null;
    this.subscriptions.add(this.regionService.find('code:' + this.selectedRegions[0].code).subscribe(
      (data) => {
        this.region = data.length !== 1 ? null : data[0];
        this.region.code = this.updateCode;
        this.region.country = this.updateCountry;

        if (null !== this.region) {
          this.subscriptions.add(this.regionService.set(this.region).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.region = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateCountry = null;
              this.selectedRegions = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.region = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateCountry = null;
              this.selectedRegions = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedRegions.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected region?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.regionService.deleteListByIds(ids).subscribe(
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
