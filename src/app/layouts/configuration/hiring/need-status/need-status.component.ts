import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {NeedStatus} from '../../../../shared/models/configuration/hiring/need-status';
import {NeedStatusService} from '../../../../shared/services/api/configuration/hiring/need-status.service';
import {AuthenticationService} from '../../../../shared/services/api/authentication.service';
import {Organization} from '../../../../shared/models/configuration/organization';


@Component({
  selector: 'app-need-status',
  templateUrl: './need-status.component.html',
  styleUrls: ['./need-status.component.css']
})
export class NeedStatusComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedNeedStatuses: Array<NeedStatus> = [];
  loading: boolean;
  needStatusList: Array<NeedStatus> = [];
  className: string;
  cols: any[];
  editMode: number;
  needStatusExportList: Array<NeedStatus> = [];
  listTitle = 'Liste des needStatuses';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];


  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  needStatus: NeedStatus;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  // Component Attributes // Update
  updateCode: string;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;

  constructor(private needStatusService: NeedStatusService,
              private spinner: NgxSpinnerService,
              private globalService: GlobalService,
              private confirmationService: ConfirmationService,
              private authenticationService: AuthenticationService,
              private messageService: MessageService,
              private toastr: ToastrService,
              private router: Router,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' NeedStatus'},
      {label: 'Lister', routerLink: '/core/needStatus'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = NeedStatus.name;
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

    this.subscriptions.add(this.needStatusService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      }
    ));
    this.subscriptions.add(this.needStatusService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.needStatusList = data;
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
    this.subscriptions.add(this.needStatusService.findAll().subscribe(
      data => {
        this.needStatusExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.needStatusExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.needStatusExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.needStatusService.findAll().subscribe(
      data => {
        this.needStatusExportList = data;
        this.globalService.generatePdf(event, this.needStatusExportList, this.className, this.listTitle);
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

    this.subscriptions.add(this.needStatusService.find(this.searchSentence).subscribe(
      (data) => {
        this.needStatusList = data;
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
    this.selectedNeedStatuses = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedNeedStatuses[0].code.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.needStatus = new NeedStatus();
    this.needStatus.code = this.addCode;

    this.subscriptions.add(this.needStatusService.set(this.needStatus).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.needStatus = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedNeedStatuses = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.needStatus = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedNeedStatuses = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.needStatus = null;
    this.subscriptions.add(this.needStatusService.find('code:' + this.selectedNeedStatuses[0].code).subscribe(
      (data) => {
        this.needStatus = data.length !== 1 ? null : data[0];
        this.needStatus.code = this.updateCode;

        if (null !== this.needStatus) {
          this.subscriptions.add(this.needStatusService.set(this.needStatus).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.needStatus = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedNeedStatuses = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.needStatus = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedNeedStatuses = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedNeedStatuses.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected needStatus?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.needStatusService.deleteListByIds(ids).subscribe(
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
