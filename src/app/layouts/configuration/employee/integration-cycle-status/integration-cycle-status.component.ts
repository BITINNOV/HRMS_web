import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {IntegrationCycleStatus} from '../../../../shared/models/configuration/employee/integration-cycle-status';
import {IntegrationCycleStatusService} from '../../../../shared/services/api/configuration/employee/integration-cycle-status.service';
import {AuthenticationService} from '../../../../shared/services/api/authentication.service';
import {Organization} from '../../../../shared/models/configuration/organization';

@Component({
  selector: 'app-integration-cycle-status',
  templateUrl: './integration-cycle-status.component.html',
  styleUrls: ['./integration-cycle-status.component.css']
})
export class IntegrationCycleStatusComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedIntegrationCycleStatuses: Array<IntegrationCycleStatus> = [];
  loading: boolean;
  integrationCycleStatusList: Array<IntegrationCycleStatus> = [];
  className: string;
  cols: any[];
  editMode: number;
  integrationCycleStatusExportList: Array<IntegrationCycleStatus> = [];
  listTitle = 'Liste des validation cycle statuses';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  integrationCycleStatus: IntegrationCycleStatus;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  // Component Attributes // Update
  updateCode: string;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;

  constructor(private integrationCycleStatusService: IntegrationCycleStatusService,
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
      {label: ' IntegrationCycleStatus'},
      {label: 'Lister', routerLink: '/core/integrationCycleStatus'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = IntegrationCycleStatus.name;
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
    this.subscriptions.add(this.integrationCycleStatusService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      }
    ));
    this.subscriptions.add(this.integrationCycleStatusService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.integrationCycleStatusList = data;
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
    this.subscriptions.add(this.integrationCycleStatusService.findAll().subscribe(
      data => {
        this.integrationCycleStatusExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.integrationCycleStatusExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.integrationCycleStatusExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.integrationCycleStatusService.findAll().subscribe(
      data => {
        this.integrationCycleStatusExportList = data;
        this.globalService.generatePdf(event, this.integrationCycleStatusExportList, this.className, this.listTitle);
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
    this.searchSentence = 'code:' + this.searchCode + ',';
    this.searchSentence += 'organization.code:' + this.currentOrganization.code;

    this.subscriptions.add(this.integrationCycleStatusService.find(this.searchSentence).subscribe(
      (data) => {
        this.integrationCycleStatusList = data;
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
    this.selectedIntegrationCycleStatuses = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedIntegrationCycleStatuses[0].code.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.integrationCycleStatus = new IntegrationCycleStatus();
    this.integrationCycleStatus.code = this.addCode;

    this.subscriptions.add(this.integrationCycleStatusService.set(this.integrationCycleStatus).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.integrationCycleStatus = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedIntegrationCycleStatuses = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.integrationCycleStatus = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedIntegrationCycleStatuses = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.integrationCycleStatus = null;
    this.subscriptions.add(this.integrationCycleStatusService.find('code:' + this.selectedIntegrationCycleStatuses[0].code).subscribe(
      (data) => {
        this.integrationCycleStatus = data.length !== 1 ? null : data[0];
        this.integrationCycleStatus.code = this.updateCode;

        if (null !== this.integrationCycleStatus) {
          this.subscriptions.add(this.integrationCycleStatusService.set(this.integrationCycleStatus).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.integrationCycleStatus = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedIntegrationCycleStatuses = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.integrationCycleStatus = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedIntegrationCycleStatuses = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedIntegrationCycleStatuses.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected integrationCycleStatus?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.integrationCycleStatusService.deleteListByIds(ids).subscribe(
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
