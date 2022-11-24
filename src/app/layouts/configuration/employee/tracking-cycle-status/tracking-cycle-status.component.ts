import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {TrackingCycleStatusService} from '../../../../shared/services/api/configuration/employee/tracking-cycle-status.service';
import {TrackingCycleStatus} from '../../../../shared/models/configuration/employee/tracking-cycle-status';
import {Organization} from '../../../../shared/models/configuration/organization';
import {AuthenticationService} from '../../../../shared/services/api/authentication.service';

@Component({
  selector: 'app-tracking-cycle-status',
  templateUrl: './tracking-cycle-status.component.html',
  styleUrls: ['./tracking-cycle-status.component.css']
})
export class TrackingCycleStatusComponent implements OnInit, OnDestroy, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedTrackingCycleStatuses: Array<TrackingCycleStatus> = [];
  loading: boolean;
  trackingCycleStatusList: Array<TrackingCycleStatus> = [];
  className: string;
  cols: any[];
  editMode: number;
  trackingCycleStatusExportList: Array<TrackingCycleStatus> = [];
  listTitle = 'Liste des validation cycle statuses';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  trackingCycleStatus: TrackingCycleStatus;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  // Component Attributes // Update
  updateCode: string;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;

  constructor(private trackingCycleStatusService: TrackingCycleStatusService,
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
      {label: ' TrackingCycleStatus'},
      {label: 'Lister', routerLink: '/core/trackingCycleStatus'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = TrackingCycleStatus.name;
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
    this.subscriptions.add(this.trackingCycleStatusService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      }
    ));
    this.subscriptions.add(this.trackingCycleStatusService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.trackingCycleStatusList = data;
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
    this.subscriptions.add(this.trackingCycleStatusService.findAll().subscribe(
      data => {
        this.trackingCycleStatusExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.trackingCycleStatusExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.trackingCycleStatusExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.trackingCycleStatusService.findAll().subscribe(
      data => {
        this.trackingCycleStatusExportList = data;
        this.globalService.generatePdf(event, this.trackingCycleStatusExportList, this.className, this.listTitle);
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

    this.subscriptions.add(this.trackingCycleStatusService.find(this.searchSentence).subscribe(
      (data) => {
        this.trackingCycleStatusList = data;
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
    this.selectedTrackingCycleStatuses = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedTrackingCycleStatuses[0].code.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.trackingCycleStatus = new TrackingCycleStatus();
    this.trackingCycleStatus.code = this.addCode;

    this.subscriptions.add(this.trackingCycleStatusService.set(this.trackingCycleStatus).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.trackingCycleStatus = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedTrackingCycleStatuses = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.trackingCycleStatus = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedTrackingCycleStatuses = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.trackingCycleStatus = null;
    this.subscriptions.add(this.trackingCycleStatusService.find('code:' + this.selectedTrackingCycleStatuses[0].code).subscribe(
      (data) => {
        this.trackingCycleStatus = data.length !== 1 ? null : data[0];
        this.trackingCycleStatus.code = this.updateCode;

        if (null !== this.trackingCycleStatus) {
          this.subscriptions.add(this.trackingCycleStatusService.set(this.trackingCycleStatus).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.trackingCycleStatus = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedTrackingCycleStatuses = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.trackingCycleStatus = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedTrackingCycleStatuses = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedTrackingCycleStatuses.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected trackingCycleStatus?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.trackingCycleStatusService.deleteListByIds(ids).subscribe(
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
