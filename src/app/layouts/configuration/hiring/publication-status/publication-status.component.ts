import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {PublicationStatus} from '../../../../shared/models/configuration/hiring/publication-status';
import {PublicationStatusService} from '../../../../shared/services/api/configuration/hiring/publication-status.service';
import {AuthenticationService} from '../../../../shared/services/api/authentication.service';
import {Organization} from '../../../../shared/models/configuration/organization';


@Component({
  selector: 'app-publication-status',
  templateUrl: './publication-status.component.html',
  styleUrls: ['./publication-status.component.css']
})
export class PublicationStatusComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedPublicationStatuses: Array<PublicationStatus> = [];
  loading: boolean;
  publicationStatusList: Array<PublicationStatus> = [];
  className: string;
  cols: any[];
  editMode: number;
  publicationStatusExportList: Array<PublicationStatus> = [];
  listTitle = 'Liste des publicationStatuses';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];


  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  publicationStatus: PublicationStatus;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  // Component Attributes // Update
  updateCode: string;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;

  constructor(private publicationStatusService: PublicationStatusService,
              private spinner: NgxSpinnerService,
              private globalService: GlobalService,
              private authenticationService: AuthenticationService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private toastr: ToastrService,
              private router: Router,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' PublicationStatus'},
      {label: 'Lister', routerLink: '/core/publicationStatus'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = PublicationStatus.name;
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
    // Set Current Organization
    this.currentOrganization = this.authenticationService.getCurrentOrganization();
    // List search sentence
    this.searchSentence = '';
    this.searchSentence = 'organization.code:' + this.currentOrganization.code;

    this.subscriptions.add(this.publicationStatusService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      }
    ));
    this.subscriptions.add(this.publicationStatusService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.publicationStatusList = data;
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
    this.subscriptions.add(this.publicationStatusService.findAll().subscribe(
      data => {
        this.publicationStatusExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.publicationStatusExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.publicationStatusExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.publicationStatusService.findAll().subscribe(
      data => {
        this.publicationStatusExportList = data;
        this.globalService.generatePdf(event, this.publicationStatusExportList, this.className, this.listTitle);
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
    this.searchSentence = 'code:' + this.searchCode;

    this.subscriptions.add(this.publicationStatusService.find(this.searchSentence).subscribe(
      (data) => {
        this.publicationStatusList = data;
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
    this.selectedPublicationStatuses = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedPublicationStatuses[0].code.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.publicationStatus = new PublicationStatus();
    this.publicationStatus.code = this.addCode;

    this.subscriptions.add(this.publicationStatusService.set(this.publicationStatus).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.publicationStatus = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedPublicationStatuses = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.publicationStatus = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedPublicationStatuses = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.publicationStatus = null;
    this.subscriptions.add(this.publicationStatusService.find('code:' + this.selectedPublicationStatuses[0].code).subscribe(
      (data) => {
        this.publicationStatus = data.length !== 1 ? null : data[0];
        this.publicationStatus.code = this.updateCode;

        if (null !== this.publicationStatus) {
          this.subscriptions.add(this.publicationStatusService.set(this.publicationStatus).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.publicationStatus = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedPublicationStatuses = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.publicationStatus = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedPublicationStatuses = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedPublicationStatuses.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected publicationStatus?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.publicationStatusService.deleteListByIds(ids).subscribe(
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
