import {Component, Inject, LOCALE_ID, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {EstablishmentType} from '../../../../shared/models/configuration/hiring/establishment-type';
import {EstablishmentTypeService} from '../../../../shared/services/api/configuration/hiring/establishment-type.service';


@Component({
  selector: 'app-establishment-type',
  templateUrl: './establishment-type.component.html',
  styleUrls: ['./establishment-type.component.css']
})
export class EstablishmentTypeComponent implements OnInit {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedEstablishmentTypes: Array<EstablishmentType> = [];
  loading: boolean;
  establishmentTypeList: Array<EstablishmentType> = [];
  className: string;
  cols: any[];
  editMode: number;
  establishmentTypeExportList: Array<EstablishmentType> = [];
  listTitle = 'Liste des establishment types';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];


  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  establishmentType: EstablishmentType;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  // Component Attributes // Update
  updateCode: string;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;

  constructor(private establishmentTypeService: EstablishmentTypeService,
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
      {label: ' EstablishmentType'},
      {label: 'Lister', routerLink: '/core/establishmentType'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = EstablishmentType.name;
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
    this.subscriptions.add(this.establishmentTypeService.size().subscribe(
      data => {
        this.collectionSize = data;
      }
    ));
    this.subscriptions.add(this.establishmentTypeService.findAllPagination(this.page, this.size).subscribe(
      data => {
        this.establishmentTypeList = data;
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
    this.subscriptions.add(this.establishmentTypeService.findAll().subscribe(
      data => {
        this.establishmentTypeExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.establishmentTypeExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.establishmentTypeExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.establishmentTypeService.findAll().subscribe(
      data => {
        this.establishmentTypeExportList = data;
        this.globalService.generatePdf(event, this.establishmentTypeExportList, this.className, this.listTitle);
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

    this.subscriptions.add(this.establishmentTypeService.find(this.searchSentence).subscribe(
      (data) => {
        this.establishmentTypeList = data;
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
    this.selectedEstablishmentTypes = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedEstablishmentTypes[0].code.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.establishmentType = new EstablishmentType();
    this.establishmentType.code = this.addCode;

    this.subscriptions.add(this.establishmentTypeService.set(this.establishmentType).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.establishmentType = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedEstablishmentTypes = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.establishmentType = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedEstablishmentTypes = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.establishmentType = null;
    this.subscriptions.add(this.establishmentTypeService.find('code:' + this.selectedEstablishmentTypes[0].code).subscribe(
      (data) => {
        this.establishmentType = data.length !== 1 ? null : data[0];
        this.establishmentType.code = this.updateCode;

        if (null !== this.establishmentType) {
          this.subscriptions.add(this.establishmentTypeService.set(this.establishmentType).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.establishmentType = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedEstablishmentTypes = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.establishmentType = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedEstablishmentTypes = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedEstablishmentTypes.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected establishmentType?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.establishmentTypeService.deleteListByIds(ids).subscribe(
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
