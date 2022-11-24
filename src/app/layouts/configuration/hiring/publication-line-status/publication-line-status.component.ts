import {Component, Inject, LOCALE_ID, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {PublicationLineStatus} from '../../../../shared/models/configuration/hiring/publication-line-status';
import {PublicationLineStatusService} from '../../../../shared/services/api/configuration/hiring/publication-line-status.service';


@Component({
  selector: 'app-publication-line-status',
  templateUrl: './publication-line-status.component.html',
  styleUrls: ['./publication-line-status.component.css']
})
export class PublicationLineStatusComponent implements OnInit {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedPublicationLineStatuses: Array<PublicationLineStatus> = [];
  loading: boolean;
  publicationLineStatusList: Array<PublicationLineStatus> = [];
  className: string;
  cols: any[];
  editMode: number;
  publicationLineStatusExportList: Array<PublicationLineStatus> = [];
  listTitle = 'Liste des publicationLineStatuses';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];


  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  publicationLineStatus: PublicationLineStatus;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  // Component Attributes // Update
  updateCode: string;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;

  constructor(private publicationLineStatusService: PublicationLineStatusService,
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
      {label: ' PublicationLineStatus'},
      {label: 'Lister', routerLink: '/core/publicationLineStatus'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = PublicationLineStatus.name;
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
    this.subscriptions.add(this.publicationLineStatusService.size().subscribe(
      data => {
        this.collectionSize = data;
      }
    ));
    this.subscriptions.add(this.publicationLineStatusService.findAllPagination(this.page, this.size).subscribe(
      data => {
        this.publicationLineStatusList = data;
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
    this.subscriptions.add(this.publicationLineStatusService.findAll().subscribe(
      data => {
        this.publicationLineStatusExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.publicationLineStatusExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.publicationLineStatusExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.publicationLineStatusService.findAll().subscribe(
      data => {
        this.publicationLineStatusExportList = data;
        this.globalService.generatePdf(event, this.publicationLineStatusExportList, this.className, this.listTitle);
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

    this.subscriptions.add(this.publicationLineStatusService.find(this.searchSentence).subscribe(
      (data) => {
        this.publicationLineStatusList = data;
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
    this.selectedPublicationLineStatuses = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedPublicationLineStatuses[0].code.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.publicationLineStatus = new PublicationLineStatus();
    this.publicationLineStatus.code = this.addCode;

    this.subscriptions.add(this.publicationLineStatusService.set(this.publicationLineStatus).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.publicationLineStatus = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedPublicationLineStatuses = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.publicationLineStatus = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedPublicationLineStatuses = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.publicationLineStatus = null;
    this.subscriptions.add(this.publicationLineStatusService.find('code:' + this.selectedPublicationLineStatuses[0].code).subscribe(
      (data) => {
        this.publicationLineStatus = data.length !== 1 ? null : data[0];
        this.publicationLineStatus.code = this.updateCode;

        if (null !== this.publicationLineStatus) {
          this.subscriptions.add(this.publicationLineStatusService.set(this.publicationLineStatus).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.publicationLineStatus = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedPublicationLineStatuses = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.publicationLineStatus = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedPublicationLineStatuses = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedPublicationLineStatuses.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected publicationLineStatus?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.publicationLineStatusService.deleteListByIds(ids).subscribe(
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
