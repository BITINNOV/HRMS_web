import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {TrackingCycleLineStatus} from '../../../../shared/models/configuration/employee/tracking-cycle-line-status';
import {TrackingCycleLineStatusService} from '../../../../shared/services/api/configuration/employee/tracking-cycle-line-status.service';
import {AuthenticationService} from '../../../../shared/services/api/authentication.service';
import {Organization} from '../../../../shared/models/configuration/organization';

@Component({
  selector: 'app-tracking-cycle-line-status',
  templateUrl: './tracking-cycle-line-status.component.html',
  styleUrls: ['./tracking-cycle-line-status.component.css']
})
export class TrackingCycleLineStatusComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedTrackingCycleLineStatuses: Array<TrackingCycleLineStatus> = [];
  loading: boolean;
  trackingCycleLineStatusList: Array<TrackingCycleLineStatus> = [];
  className: string;
  cols: any[];
  editMode: number;
  trackingCycleLineStatusExportList: Array<TrackingCycleLineStatus> = [];
  listTitle = 'Liste des validation cycle statuses';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  trackingCycleLineStatus: TrackingCycleLineStatus;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  // Component Attributes // Update
  updateCode: string;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;

  constructor(private trackingCycleLineStatusService: TrackingCycleLineStatusService,
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
      {label: ' TrackingCycleLineStatus'},
      {label: 'Lister', routerLink: '/core/trackingCycleLineStatus'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = TrackingCycleLineStatus.name;
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
    this.subscriptions.add(this.trackingCycleLineStatusService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      }
    ));
    this.subscriptions.add(this.trackingCycleLineStatusService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.trackingCycleLineStatusList = data;
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
    this.subscriptions.add(this.trackingCycleLineStatusService.findAll().subscribe(
      data => {
        this.trackingCycleLineStatusExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.trackingCycleLineStatusExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.trackingCycleLineStatusExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.trackingCycleLineStatusService.findAll().subscribe(
      data => {
        this.trackingCycleLineStatusExportList = data;
        this.globalService.generatePdf(event, this.trackingCycleLineStatusExportList, this.className, this.listTitle);
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

    this.subscriptions.add(this.trackingCycleLineStatusService.find(this.searchSentence).subscribe(
      (data) => {
        this.trackingCycleLineStatusList = data;
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
    this.selectedTrackingCycleLineStatuses = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedTrackingCycleLineStatuses[0].code.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.trackingCycleLineStatus = new TrackingCycleLineStatus();
    this.trackingCycleLineStatus.code = this.addCode;

    this.subscriptions.add(this.trackingCycleLineStatusService.set(this.trackingCycleLineStatus).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.trackingCycleLineStatus = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedTrackingCycleLineStatuses = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.trackingCycleLineStatus = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedTrackingCycleLineStatuses = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.trackingCycleLineStatus = null;
    this.subscriptions.add(this.trackingCycleLineStatusService.find('code:' + this.selectedTrackingCycleLineStatuses[0].code).subscribe(
      (data) => {
        this.trackingCycleLineStatus = data.length !== 1 ? null : data[0];
        this.trackingCycleLineStatus.code = this.updateCode;

        if (null !== this.trackingCycleLineStatus) {
          this.subscriptions.add(this.trackingCycleLineStatusService.set(this.trackingCycleLineStatus).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.trackingCycleLineStatus = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedTrackingCycleLineStatuses = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.trackingCycleLineStatus = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedTrackingCycleLineStatuses = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedTrackingCycleLineStatuses.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected trackingCycleLineStatus?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.trackingCycleLineStatusService.deleteListByIds(ids).subscribe(
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
