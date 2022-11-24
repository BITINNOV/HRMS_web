import {Component, Inject, LOCALE_ID, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {ResumeStatus} from '../../../../shared/models/configuration/hiring/resume-status';
import {ResumeStatusService} from '../../../../shared/services/api/configuration/hiring/resume-status.service';


@Component({
  selector: 'app-resume-status',
  templateUrl: './resume-status.component.html',
  styleUrls: ['./resume-status.component.css']
})
export class ResumeStatusComponent implements OnInit {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedResumeStatuses: Array<ResumeStatus> = [];
  loading: boolean;
  resumeStatusList: Array<ResumeStatus> = [];
  className: string;
  cols: any[];
  editMode: number;
  resumeStatusExportList: Array<ResumeStatus> = [];
  listTitle = 'Liste des resumeStatuses';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];


  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  resumeStatus: ResumeStatus;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  // Component Attributes // Update
  updateCode: string;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;

  constructor(private resumeStatusService: ResumeStatusService,
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
      {label: ' ResumeStatus'},
      {label: 'Lister', routerLink: '/core/resumeStatus'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = ResumeStatus.name;
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
    this.subscriptions.add(this.resumeStatusService.size().subscribe(
      data => {
        this.collectionSize = data;
      }
    ));
    this.subscriptions.add(this.resumeStatusService.findAllPagination(this.page, this.size).subscribe(
      data => {
        this.resumeStatusList = data;
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
    this.subscriptions.add(this.resumeStatusService.findAll().subscribe(
      data => {
        this.resumeStatusExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.resumeStatusExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.resumeStatusExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.resumeStatusService.findAll().subscribe(
      data => {
        this.resumeStatusExportList = data;
        this.globalService.generatePdf(event, this.resumeStatusExportList, this.className, this.listTitle);
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

    this.subscriptions.add(this.resumeStatusService.find(this.searchSentence).subscribe(
      (data) => {
        this.resumeStatusList = data;
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
    this.selectedResumeStatuses = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedResumeStatuses[0].code.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.resumeStatus = new ResumeStatus();
    this.resumeStatus.code = this.addCode;

    this.subscriptions.add(this.resumeStatusService.set(this.resumeStatus).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.resumeStatus = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedResumeStatuses = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.resumeStatus = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedResumeStatuses = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.resumeStatus = null;
    this.subscriptions.add(this.resumeStatusService.find('code:' + this.selectedResumeStatuses[0].code).subscribe(
      (data) => {
        this.resumeStatus = data.length !== 1 ? null : data[0];
        this.resumeStatus.code = this.updateCode;

        if (null !== this.resumeStatus) {
          this.subscriptions.add(this.resumeStatusService.set(this.resumeStatus).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.resumeStatus = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedResumeStatuses = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.resumeStatus = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedResumeStatuses = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedResumeStatuses.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected resumeStatus?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.resumeStatusService.deleteListByIds(ids).subscribe(
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
