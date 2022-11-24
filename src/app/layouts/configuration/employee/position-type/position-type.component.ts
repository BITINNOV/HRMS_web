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
import {PositionType} from '../../../../shared/models/configuration/employee/position-type';
import {PositionTypeService} from '../../../../shared/services/api/configuration/employee/position-type.service';

@Component({
  selector: 'app-position-type',
  templateUrl: './position-type.component.html',
  styleUrls: ['./position-type.component.css']
})
export class PositionTypeComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedPositionTypes: Array<PositionType> = [];
  loading: boolean;
  positionTypeList: Array<PositionType> = [];
  className: string;
  cols: any[];
  editMode: number;
  positionTypeExportList: Array<PositionType> = [];
  listTitle = 'Liste des position types';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  positionType: PositionType;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  addValidate: boolean;
  // Component Attributes // Update
  updateCode: string;
  updateValidate: boolean;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;
  searchValidate: boolean;

  constructor(private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private authenticationService: AuthenticationService,
              private globalService: GlobalService,
              private positionTypeService: PositionTypeService,
              private confirmationService: ConfirmationService,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' PositionType'},
      {label: 'Lister', routerLink: '/core/positionType'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = PositionType.name;
    this.cols = [
      {field: 'code', header: 'Code', type: 'string'},
      {field: 'validate', header: 'Validate', type: 'boolean'},
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
    this.subscriptions.add(this.positionTypeService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      },
      error => {
        this.toastr.error(error.message);
      }
    ));
    this.subscriptions.add(this.positionTypeService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.positionTypeList = data;
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
    this.subscriptions.add(this.positionTypeService.findAll().subscribe(
      data => {
        this.positionTypeExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.positionTypeExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.positionTypeExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.positionTypeService.findAll().subscribe(
      data => {
        this.positionTypeExportList = data;
        this.globalService.generatePdf(event, this.positionTypeExportList, this.className, this.listTitle);
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
    if (this.searchValidate) {
      this.searchSentence += 'validate:' + this.searchValidate + ',';
    }
    this.searchSentence += 'organization.code:' + this.currentOrganization.code;

    this.subscriptions.add(this.positionTypeService.find(this.searchSentence).subscribe(
      (data) => {
        this.positionTypeList = data;
      },
      (error) => {
        this.toastr.error(error.message);
      }
    ));
  }

  reset() {
    this.searchSentence = null;
    this.searchCode = null;
    this.searchValidate = null;

    this.loadData();
  }

  onObjectEdited(event) {
    this.editMode = event.operationMode;
    this.selectedPositionTypes = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedPositionTypes[0].code.toString();
      this.updateValidate = this.selectedPositionTypes[0].validate;
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.positionType = new PositionType();
    this.positionType.code = this.addCode;
    this.positionType.validate = this.addValidate;
    this.positionType.organization = this.currentOrganization;
    this.subscriptions.add(this.positionTypeService.set(this.positionType).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.positionType = null;
        this.addCode = null;
        this.addValidate = null;
        this.editMode = null;
        this.selectedPositionTypes = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.positionType = null;
        this.addCode = null;
        this.addValidate = null;
        this.editMode = null;
        this.selectedPositionTypes = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.positionType = null;
    this.subscriptions.add(this.positionTypeService.find('code:' + this.selectedPositionTypes[0].code).subscribe(
      (data) => {
        this.positionType = data.length !== 1 ? null : data[0];
        this.positionType.code = this.updateCode;
        this.positionType.validate = this.updateValidate;

        if (null !== this.positionType) {
          this.subscriptions.add(this.positionTypeService.set(this.positionType).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.positionType = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateValidate = null;
              this.selectedPositionTypes = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.positionType = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateValidate = null;
              this.selectedPositionTypes = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedPositionTypes.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected positionType?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.positionTypeService.deleteListByIds(ids).subscribe(
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
