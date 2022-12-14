import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {PublicationType} from '../../../../shared/models/configuration/hiring/publication-type';
import {PublicationTypeService} from '../../../../shared/services/api/configuration/hiring/publication-type.service';
import {AuthenticationService} from '../../../../shared/services/api/authentication.service';
import {Organization} from '../../../../shared/models/configuration/organization';


@Component({
  selector: 'app-publication-type',
  templateUrl: './publication-type.component.html',
  styleUrls: ['./publication-type.component.css']
})
export class PublicationTypeComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedPublicationTypes: Array<PublicationType> = [];
  loading: boolean;
  publicationTypeList: Array<PublicationType> = [];
  className: string;
  cols: any[];
  editMode: number;
  publicationTypeExportList: Array<PublicationType> = [];
  listTitle = 'Liste des publicationTypes';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];


  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  publicationType: PublicationType;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  // Component Attributes // Update
  updateCode: string;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;

  constructor(private publicationTypeService: PublicationTypeService,
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
      {label: ' PublicationType'},
      {label: 'Lister', routerLink: '/core/publicationType'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = PublicationType.name;
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

    this.subscriptions.add(this.publicationTypeService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      }
    ));
    this.subscriptions.add(this.publicationTypeService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.publicationTypeList = data;
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
    this.subscriptions.add(this.publicationTypeService.findAll().subscribe(
      data => {
        this.publicationTypeExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.publicationTypeExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.publicationTypeExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.publicationTypeService.findAll().subscribe(
      data => {
        this.publicationTypeExportList = data;
        this.globalService.generatePdf(event, this.publicationTypeExportList, this.className, this.listTitle);
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

    this.subscriptions.add(this.publicationTypeService.find(this.searchSentence).subscribe(
      (data) => {
        this.publicationTypeList = data;
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
    this.selectedPublicationTypes = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedPublicationTypes[0].code.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.publicationType = new PublicationType();
    this.publicationType.code = this.addCode;

    this.subscriptions.add(this.publicationTypeService.set(this.publicationType).subscribe(
      (data) => {
        this.toastr.success('El??ment est Enregistr?? Avec Succ??s', 'Cr??ation');
        this.publicationType = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedPublicationTypes = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.publicationType = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedPublicationTypes = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.publicationType = null;
    this.subscriptions.add(this.publicationTypeService.find('code:' + this.selectedPublicationTypes[0].code).subscribe(
      (data) => {
        this.publicationType = data.length !== 1 ? null : data[0];
        this.publicationType.code = this.updateCode;

        if (null !== this.publicationType) {
          this.subscriptions.add(this.publicationTypeService.set(this.publicationType).subscribe(
            (data1) => {
              this.toastr.success('El??ment est Enregistr?? Avec Succ??s', 'Edition');
              this.publicationType = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedPublicationTypes = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.publicationType = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedPublicationTypes = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedPublicationTypes.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected publicationType?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.publicationTypeService.deleteListByIds(ids).subscribe(
          (data) => {
            this.toastr.success('El??ment Supprimer avec Succ??s', 'Suppression');
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
