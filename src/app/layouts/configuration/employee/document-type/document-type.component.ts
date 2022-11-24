import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {DocumentType} from '../../../../shared/models/configuration/employee/document-type';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {DocumentTypeService} from '../../../../shared/services/api/configuration/employee/document-type.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {Organization} from '../../../../shared/models/configuration/organization';
import {AuthenticationService} from '../../../../shared/services/api/authentication.service';

@Component({
  selector: 'app-document-type',
  templateUrl: './document-type.component.html',
  styleUrls: ['./document-type.component.css']
})
export class DocumentTypeComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedDocumentTypes: Array<DocumentType> = [];
  loading: boolean;
  documentTypeList: Array<DocumentType> = [];
  className: string;
  cols: any[];
  editMode: number;
  documentTypeExportList: Array<DocumentType> = [];
  listTitle = 'Liste des validation cycle statuses';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  documentType: DocumentType;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  // Component Attributes // Update
  updateCode: string;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;

  constructor(private documentTypeService: DocumentTypeService,
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
      {label: ' DocumentType'},
      {label: 'Lister', routerLink: '/core/documentType'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = DocumentType.name;
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
    this.subscriptions.add(this.documentTypeService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      }
    ));
    this.subscriptions.add(this.documentTypeService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.documentTypeList = data;
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
    this.subscriptions.add(this.documentTypeService.findAll().subscribe(
      data => {
        this.documentTypeExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.documentTypeExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.documentTypeExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.documentTypeService.findAll().subscribe(
      data => {
        this.documentTypeExportList = data;
        this.globalService.generatePdf(event, this.documentTypeExportList, this.className, this.listTitle);
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

    this.subscriptions.add(this.documentTypeService.find(this.searchSentence).subscribe(
      (data) => {
        this.documentTypeList = data;
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
    this.selectedDocumentTypes = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedDocumentTypes[0].code.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.documentType = new DocumentType();
    this.documentType.code = this.addCode;

    this.subscriptions.add(this.documentTypeService.set(this.documentType).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.documentType = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedDocumentTypes = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.documentType = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedDocumentTypes = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.documentType = null;
    this.subscriptions.add(this.documentTypeService.find('code:' + this.selectedDocumentTypes[0].code).subscribe(
      (data) => {
        this.documentType = data.length !== 1 ? null : data[0];
        this.documentType.code = this.updateCode;

        if (null !== this.documentType) {
          this.subscriptions.add(this.documentTypeService.set(this.documentType).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.documentType = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedDocumentTypes = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.documentType = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedDocumentTypes = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedDocumentTypes.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected documentType?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.documentTypeService.deleteListByIds(ids).subscribe(
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
