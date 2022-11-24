import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {AbsenceType} from '../../../../shared/models/configuration/employee/absence-type';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {AbsenceTypeService} from '../../../../shared/services/api/configuration/employee/absence-type.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {Organization} from '../../../../shared/models/configuration/organization';
import {AuthenticationService} from '../../../../shared/services/api/authentication.service';

@Component({
  selector: 'app-absence-type',
  templateUrl: './absence-type.component.html',
  styleUrls: ['./absence-type.component.css']
})
export class AbsenceTypeComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedAbsenceTypes: Array<AbsenceType> = [];
  loading: boolean;
  absenceTypeList: Array<AbsenceType> = [];
  className: string;
  cols: any[];
  editMode: number;
  absenceTypeExportList: Array<AbsenceType> = [];
  listTitle = 'Liste des types absence';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  absenceType: AbsenceType;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  // Component Attributes // Update
  updateCode: string;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;

  constructor(private absenceTypeService: AbsenceTypeService,
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
      {label: ' AbsenceType'},
      {label: 'Lister', routerLink: '/core/absenceType'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = AbsenceType.name;
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
    this.subscriptions.add(this.absenceTypeService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      }
    ));
    this.subscriptions.add(this.absenceTypeService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.absenceTypeList = data;
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
    this.subscriptions.add(this.absenceTypeService.findAll().subscribe(
      data => {
        this.absenceTypeExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.absenceTypeExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.absenceTypeExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.absenceTypeService.findAll().subscribe(
      data => {
        this.absenceTypeExportList = data;
        this.globalService.generatePdf(event, this.absenceTypeExportList, this.className, this.listTitle);
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

    this.subscriptions.add(this.absenceTypeService.find(this.searchSentence).subscribe(
      (data) => {
        this.absenceTypeList = data;
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
    this.selectedAbsenceTypes = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedAbsenceTypes[0].code.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.absenceType = new AbsenceType();
    this.absenceType.code = this.addCode;
    this.absenceType.organization = this.currentOrganization;

    this.subscriptions.add(this.absenceTypeService.set(this.absenceType).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.absenceType = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedAbsenceTypes = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.absenceType = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedAbsenceTypes = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.absenceType = null;
    this.subscriptions.add(this.absenceTypeService.find('code:' + this.selectedAbsenceTypes[0].code).subscribe(
      (data) => {
        this.absenceType = data.length !== 1 ? null : data[0];
        this.absenceType.code = this.updateCode;

        if (null !== this.absenceType) {
          this.subscriptions.add(this.absenceTypeService.set(this.absenceType).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.absenceType = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedAbsenceTypes = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.absenceType = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedAbsenceTypes = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedAbsenceTypes.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected absenceType?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.absenceTypeService.deleteListByIds(ids).subscribe(
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
