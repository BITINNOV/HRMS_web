import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Action} from '../../../shared/models/configuration/action';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {Organization} from '../../../shared/models/configuration/organization';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthenticationService} from '../../../shared/services/api/authentication.service';
import {GlobalService} from '../../../shared/services/api/global.service';
import {ActionService} from '../../../shared/services/api/configuration/action.service';
import {ActionType} from '../../../shared/models/configuration/action-type';
import {ActionTypeService} from '../../../shared/services/api/configuration/action-type.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedActions: Array<Action> = [];
  loading: boolean;
  actionList: Array<Action> = [];
  className: string;
  cols: any[];
  editMode: number;
  actionExportList: Array<Action> = [];
  listTitle = 'Liste des actions';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];

  // Drop Down
  actionTypeList: Array<ActionType> = [];

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  action: Action;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  addActionType: ActionType;
  addDateHeureDebut: Date;
  addDateHeureFin: Date;
  addDuration: number;
  addManager: String;
  // Component Attributes // Update
  updateCode: string;
  updateActionType: ActionType;
  updateDateHeureDebut: Date;
  updateDateHeureFin: Date;
  updateDuration: number;
  updateManager: String;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;
  searchActionType: ActionType;
  searchDateHeureDebut: Date;
  searchDateHeureFin: Date;
  searchDuration: number;
  searchManager: String;

  constructor(private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private authenticationService: AuthenticationService,
              private globalService: GlobalService,
              private actionService: ActionService,
              private actionTypeService: ActionTypeService,
              private confirmationService: ConfirmationService,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' Action'},
      {label: 'Lister', routerLink: '/core/action'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = Action.name;
    this.cols = [
      {field: 'code', header: 'Code', type: 'string'},
      {field: 'actionType', child: 'code', header: 'Action Type', type: 'object'},
      {field: 'dateHeureDebut', header: 'Date Heure Debut', type: 'date'},
      {field: 'dateHeureFin', header: 'Date Heure Fin', type: 'date'},
      {field: 'duration', header: 'Duration', type: 'number'},
      {field: 'manager', header: 'Manager', type: 'string'},
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
    this.subscriptions.add(this.actionService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      },
      error => {
        this.toastr.error(error.message);
      }
    ));
    this.subscriptions.add(this.actionService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.actionList = data;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.toastr.error(error.message);
      },
      () => this.spinner.hide()
    ));
    this.subscriptions.add(this.actionTypeService.findAll().subscribe(
      (data) => {
        this.actionTypeList = data;
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
    this.subscriptions.add(this.actionService.findAll().subscribe(
      data => {
        this.actionExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.actionExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.actionExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.actionService.findAll().subscribe(
      data => {
        this.actionExportList = data;
        this.globalService.generatePdf(event, this.actionExportList, this.className, this.listTitle);
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

    this.subscriptions.add(this.actionService.find(this.searchSentence).subscribe(
      (data) => {
        this.actionList = data;
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
    this.selectedActions = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedActions[0].code.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.action = new Action();
    this.action.code = this.addCode;
    this.action.actionType = this.addActionType;
    this.action.dateHeureDebut = this.addDateHeureDebut;
    this.action.dateHeureFin = this.addDateHeureFin;
    const addDuration = this.addDateHeureFin.getTime() - this.addDateHeureDebut.getTime();
    this.action.duration = Math.floor(addDuration / 1000);
    this.action.manager = this.addManager;
    this.action.organization = this.currentOrganization;

    this.subscriptions.add(this.actionService.set(this.action).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.action = null;
        this.addCode = null;
        this.action.actionType = null;
        this.action.dateHeureDebut = null;
        this.action.dateHeureFin = null;
        this.action.duration = null;
        this.action.manager = null;
        this.editMode = null;
        this.selectedActions = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.action = null;
        this.addCode = null;
        this.action.actionType = null;
        this.action.dateHeureDebut = null;
        this.action.dateHeureFin = null;
        this.action.duration = null;
        this.action.manager = null;
        this.editMode = null;
        this.selectedActions = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.action = null;
    this.subscriptions.add(this.actionService.find('code:' + this.selectedActions[0].code).subscribe(
      (data) => {
        this.action = data.length !== 1 ? null : data[0];
        this.action.code = this.updateCode;
        this.action.actionType = this.updateActionType;
        this.action.dateHeureDebut = this.updateDateHeureDebut;
        this.action.dateHeureFin = this.updateDateHeureFin;
        const updateDuration = this.updateDateHeureFin.getTime() - this.updateDateHeureDebut.getTime();
        this.action.duration = Math.floor(updateDuration / 1000);
        this.action.manager = this.updateManager;

        if (null !== this.action) {
          this.subscriptions.add(this.actionService.set(this.action).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.action = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedActions = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.action = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedActions = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedActions.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected action?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.actionService.deleteListByIds(ids).subscribe(
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
