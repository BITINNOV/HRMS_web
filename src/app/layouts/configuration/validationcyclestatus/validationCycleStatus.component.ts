import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ValidationCycleStatus} from '../../../shared/models/configuration/validation-cycle-status';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {ValidationCycleStatusService} from '../../../shared/services/api/configuration/validation-cycle-status.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../shared/services/api/global.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {Organization} from '../../../shared/models/configuration/organization';
import {AuthenticationService} from '../../../shared/services/api/authentication.service';

@Component({
  selector: 'app-validationcyclestatus',
  templateUrl: './validationCycleStatus.component.html',
  styleUrls: ['./validationCycleStatus.component.css']
})
export class ValidationCycleStatusComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedValidationCycleStatuses: Array<ValidationCycleStatus> = [];
  loading: boolean;
  validationCycleStatusList: Array<ValidationCycleStatus> = [];
  className: string;
  cols: any[];
  editMode: number;
  validationCycleStatusExportList: Array<ValidationCycleStatus> = [];
  listTitle = 'Liste des validation cycle statuses';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  validationCycleStatus: ValidationCycleStatus;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  // Component Attributes // Update
  updateCode: string;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;

  constructor(private validationCycleStatusService: ValidationCycleStatusService,
              private authenticationService: AuthenticationService,
              private spinner: NgxSpinnerService,
              private globalService: GlobalService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private toastr: ToastrService,
              private router: Router,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' ValidationCycleStatus'},
      {label: 'Lister', routerLink: '/core/validationCycleStatus'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = ValidationCycleStatus.name;
    this.cols = [
      {field: 'code', header: 'Code', type: 'string'},
    ];
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
    this.currentOrganization = this.authenticationService.getCurrentOrganization();
    this.searchSentence = 'organization.code:' + this.currentOrganization.code;
    this.subscriptions.add(this.validationCycleStatusService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      }
    ));
    this.subscriptions.add(this.validationCycleStatusService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.validationCycleStatusList = data;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Erreur'});
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
    this.subscriptions.add(this.validationCycleStatusService.findAll().subscribe(
      data => {
        this.validationCycleStatusExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.validationCycleStatusExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.validationCycleStatusExportList, this.className, this.listTitle);
        }
        this.spinner.hide();
      },
      error => {
        this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Erreur'});
        this.spinner.hide();
      },
      () => this.spinner.hide()
    ));
  }

  onExportPdf(event) {
    this.subscriptions.add(this.validationCycleStatusService.findAll().subscribe(
      data => {
        this.validationCycleStatusExportList = data;
        this.globalService.generatePdf(event, this.validationCycleStatusExportList, this.className, this.listTitle);
        this.spinner.hide();
      },
      error => {
        this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Erreur'});
        this.spinner.hide();
        this.spinner.hide();
      },
      () => this.spinner.hide()
    ));
  }

  search() {
    this.searchSentence = '.';
    this.searchSentence = 'code:' + this.searchCode;
    this.searchSentence += 'organization.code:' + this.currentOrganization.code;

    this.subscriptions.add(this.validationCycleStatusService.find(this.searchSentence).subscribe(
      (data) => {
        this.validationCycleStatusList = data;
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
    this.selectedValidationCycleStatuses = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedValidationCycleStatuses[0].code.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.validationCycleStatus = new ValidationCycleStatus();
    this.validationCycleStatus.code = this.addCode;
    this.validationCycleStatus.organization = this.currentOrganization;

    this.subscriptions.add(this.validationCycleStatusService.set(this.validationCycleStatus).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.validationCycleStatus = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedValidationCycleStatuses = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.validationCycleStatus = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedValidationCycleStatuses = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.validationCycleStatus = null;
    this.subscriptions.add(this.validationCycleStatusService.find('code:' + this.selectedValidationCycleStatuses[0].code).subscribe(
      (data) => {
        this.validationCycleStatus = data.length !== 1 ? null : data[0];
        this.validationCycleStatus.code = this.updateCode;

        if (null !== this.validationCycleStatus) {
          this.subscriptions.add(this.validationCycleStatusService.set(this.validationCycleStatus).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.validationCycleStatus = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedValidationCycleStatuses = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.validationCycleStatus = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedValidationCycleStatuses = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedValidationCycleStatuses.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected validationCycleStatus?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.validationCycleStatusService.deleteListByIds(ids).subscribe(
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
