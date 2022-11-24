import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ValidationCycleLineStatus} from '../../../shared/models/configuration/validation-cycle-line-status';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {ValidationCycleLineStatusService} from '../../../shared/services/api/configuration/validation-cycle-line-status.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../shared/services/api/global.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {Organization} from '../../../shared/models/configuration/organization';
import {AuthenticationService} from '../../../shared/services/api/authentication.service';

@Component({
  selector: 'app-validationcyclelinestatus',
  templateUrl: './validationCycleLineStatus.component.html',
  styleUrls: ['./validationCycleLineStatus.component.css']
})
export class ValidationCycleLineStatusComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedValidationCycleLineStatuses: Array<ValidationCycleLineStatus> = [];
  loading: boolean;
  validationCycleLineStatusList: Array<ValidationCycleLineStatus> = [];
  className: string;
  cols: any[];
  editMode: number;
  validationCycleLineStatusExportList: Array<ValidationCycleLineStatus> = [];
  listTitle = 'Liste des validation cycle statuses';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  validationCycleLineStatus: ValidationCycleLineStatus;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  // Component Attributes // Update
  updateCode: string;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;

  constructor(private validationCycleLineStatusService: ValidationCycleLineStatusService,
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
      {label: ' ValidationCycleLineStatus'},
      {label: 'Lister', routerLink: '/core/validationCycleLineStatus'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = ValidationCycleLineStatus.name;
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
    this.subscriptions.add(this.validationCycleLineStatusService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      }
    ));
    this.searchSentence = 'organization.code:' + this.currentOrganization.code;

    this.subscriptions.add(this.validationCycleLineStatusService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.validationCycleLineStatusList = data;
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
    this.subscriptions.add(this.validationCycleLineStatusService.findAll().subscribe(
      data => {
        this.validationCycleLineStatusExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.validationCycleLineStatusExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.validationCycleLineStatusExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.validationCycleLineStatusService.findAll().subscribe(
      data => {
        this.validationCycleLineStatusExportList = data;
        this.globalService.generatePdf(event, this.validationCycleLineStatusExportList, this.className, this.listTitle);
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

    this.subscriptions.add(this.validationCycleLineStatusService.find(this.searchSentence).subscribe(
      (data) => {
        this.validationCycleLineStatusList = data;
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
    this.selectedValidationCycleLineStatuses = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedValidationCycleLineStatuses[0].code.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.validationCycleLineStatus = new ValidationCycleLineStatus();
    this.validationCycleLineStatus.code = this.addCode;
    this.validationCycleLineStatus.organization = this.currentOrganization;

    this.subscriptions.add(this.validationCycleLineStatusService.set(this.validationCycleLineStatus).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.validationCycleLineStatus = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedValidationCycleLineStatuses = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.validationCycleLineStatus = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedValidationCycleLineStatuses = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.validationCycleLineStatus = null;
    this.subscriptions.add(this.validationCycleLineStatusService.find('code:' + this.selectedValidationCycleLineStatuses[0].code).subscribe(
      (data) => {
        this.validationCycleLineStatus = data.length !== 1 ? null : data[0];
        this.validationCycleLineStatus.code = this.updateCode;

        if (null !== this.validationCycleLineStatus) {
          this.subscriptions.add(this.validationCycleLineStatusService.set(this.validationCycleLineStatus).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.validationCycleLineStatus = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedValidationCycleLineStatuses = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.validationCycleLineStatus = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedValidationCycleLineStatuses = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedValidationCycleLineStatuses.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected validationCycleLineStatus?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.validationCycleLineStatusService.deleteListByIds(ids).subscribe(
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
