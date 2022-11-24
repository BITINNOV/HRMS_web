import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Directorate} from '../../../../shared/models/configuration/employee/directorate';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {DirectorateService} from '../../../../shared/services/api/configuration/employee/directorate.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {Organization} from '../../../../shared/models/configuration/organization';
import {AuthenticationService} from '../../../../shared/services/api/authentication.service';

@Component({
  selector: 'app-directorate',
  templateUrl: './directorate.component.html',
  styleUrls: ['./directorate.component.css']
})
export class DirectorateComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedDirectorates: Array<Directorate> = [];
  loading: boolean;
  directorateList: Array<Directorate> = [];
  className: string;
  cols: any[];
  editMode: number;
  directorateExportList: Array<Directorate> = [];
  listTitle = 'Liste des validation cycle statuses';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  directorate: Directorate;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  // Component Attributes // Update
  updateCode: string;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;

  constructor(private directorateService: DirectorateService,
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
      {label: ' Directorate'},
      {label: 'Lister', routerLink: '/core/directorate'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = Directorate.name;
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
    this.subscriptions.add(this.directorateService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      }
    ));
    this.subscriptions.add(this.directorateService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.directorateList = data;
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
    this.subscriptions.add(this.directorateService.findAll().subscribe(
      data => {
        this.directorateExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.directorateExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.directorateExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.directorateService.findAll().subscribe(
      data => {
        this.directorateExportList = data;
        this.globalService.generatePdf(event, this.directorateExportList, this.className, this.listTitle);
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

    this.subscriptions.add(this.directorateService.find(this.searchSentence).subscribe(
      (data) => {
        this.directorateList = data;
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
    this.selectedDirectorates = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedDirectorates[0].code.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.directorate = new Directorate();
    this.directorate.code = this.addCode;
    this.directorate.organization = this.currentOrganization;

    this.subscriptions.add(this.directorateService.set(this.directorate).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.directorate = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedDirectorates = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.directorate = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedDirectorates = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.directorate = null;
    this.subscriptions.add(this.directorateService.find('code:' + this.selectedDirectorates[0].code).subscribe(
      (data) => {
        this.directorate = data.length !== 1 ? null : data[0];
        this.directorate.code = this.updateCode;

        if (null !== this.directorate) {
          this.subscriptions.add(this.directorateService.set(this.directorate).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.directorate = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedDirectorates = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.directorate = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedDirectorates = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedDirectorates.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected directorate?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.directorateService.deleteListByIds(ids).subscribe(
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
