import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {Organization} from '../../../shared/models/configuration/organization';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthenticationService} from '../../../shared/services/api/authentication.service';
import {GlobalService} from '../../../shared/services/api/global.service';
import {ActionType} from '../../../shared/models/configuration/action-type';
import {ActionTypeService} from '../../../shared/services/api/configuration/action-type.service';

@Component({
  selector: 'app-action-type',
  templateUrl: './action-type.component.html',
  styleUrls: ['./action-type.component.css']
})
export class ActionTypeComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedActionTypes: Array<ActionType> = [];
  loading: boolean;
  actionTypeList: Array<ActionType> = [];
  className: string;
  cols: any[];
  editMode: number;
  actionTypeExportList: Array<ActionType> = [];
  listTitle = 'Liste des action types';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  actionType: ActionType;
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
              private actionTypeService: ActionTypeService,
              private confirmationService: ConfirmationService,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' ActionType'},
      {label: 'Lister', routerLink: '/core/actionType'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = ActionType.name;
    this.cols = [
      {field: 'code', header: 'Code', type: 'string'},
      {field: 'organization', child: 'code', header: 'Organization', type: 'object'},
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
    this.subscriptions.add(this.actionTypeService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      },
      error => {
        this.toastr.error(error.message);
      }
    ));
    this.subscriptions.add(this.actionTypeService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.actionTypeList = data;
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
    this.subscriptions.add(this.actionTypeService.findAll().subscribe(
      data => {
        this.actionTypeExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.actionTypeExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.actionTypeExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.actionTypeService.findAll().subscribe(
      data => {
        this.actionTypeExportList = data;
        this.globalService.generatePdf(event, this.actionTypeExportList, this.className, this.listTitle);
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

    this.subscriptions.add(this.actionTypeService.find(this.searchSentence).subscribe(
      (data) => {
        this.actionTypeList = data;
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
    this.selectedActionTypes = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedActionTypes[0].code.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.actionType = new ActionType();
    this.actionType.code = this.addCode;
    this.actionType.organization = this.currentOrganization;
    this.subscriptions.add(this.actionTypeService.set(this.actionType).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.actionType = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedActionTypes = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.actionType = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedActionTypes = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.actionType = null;
    this.subscriptions.add(this.actionTypeService.find('code:' + this.selectedActionTypes[0].code).subscribe(
      (data) => {
        this.actionType = data.length !== 1 ? null : data[0];
        this.actionType.code = this.updateCode;

        if (null !== this.actionType) {
          this.subscriptions.add(this.actionTypeService.set(this.actionType).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.actionType = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedActionTypes = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.actionType = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedActionTypes = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedActionTypes.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected actionType?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.actionTypeService.deleteListByIds(ids).subscribe(
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
