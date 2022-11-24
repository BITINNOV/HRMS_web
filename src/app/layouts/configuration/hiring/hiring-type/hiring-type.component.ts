import {Component, Inject, LOCALE_ID, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {HiringType} from '../../../../shared/models/configuration/hiring/hiring-type';
import {HiringTypeService} from '../../../../shared/services/api/configuration/hiring/hiring-type.service';


@Component({
  selector: 'app-hiring-type',
  templateUrl: './hiring-type.component.html',
  styleUrls: ['./hiring-type.component.css']
})
export class HiringTypeComponent implements OnInit {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedHiringTypes: Array<HiringType> = [];
  loading: boolean;
  hiringTypeList: Array<HiringType> = [];
  className: string;
  cols: any[];
  editMode: number;
  hiringTypeExportList: Array<HiringType> = [];
  listTitle = 'Liste des hiring types';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];


  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  hiringType: HiringType;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  // Component Attributes // Update
  updateCode: string;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;

  constructor(private hiringTypeService: HiringTypeService,
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
      {label: ' HiringType'},
      {label: 'Lister', routerLink: '/core/hiringType'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = HiringType.name;
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
    this.subscriptions.add(this.hiringTypeService.size().subscribe(
      data => {
        this.collectionSize = data;
      }
    ));
    this.subscriptions.add(this.hiringTypeService.findAllPagination(this.page, this.size).subscribe(
      data => {
        this.hiringTypeList = data;
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
    this.subscriptions.add(this.hiringTypeService.findAll().subscribe(
      data => {
        this.hiringTypeExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.hiringTypeExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.hiringTypeExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.hiringTypeService.findAll().subscribe(
      data => {
        this.hiringTypeExportList = data;
        this.globalService.generatePdf(event, this.hiringTypeExportList, this.className, this.listTitle);
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

    this.subscriptions.add(this.hiringTypeService.find(this.searchSentence).subscribe(
      (data) => {
        this.hiringTypeList = data;
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
    this.selectedHiringTypes = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedHiringTypes[0].code.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.hiringType = new HiringType();
    this.hiringType.code = this.addCode;

    this.subscriptions.add(this.hiringTypeService.set(this.hiringType).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.hiringType = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedHiringTypes = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.hiringType = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedHiringTypes = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.hiringType = null;
    this.subscriptions.add(this.hiringTypeService.find('code:' + this.selectedHiringTypes[0].code).subscribe(
      (data) => {
        this.hiringType = data.length !== 1 ? null : data[0];
        this.hiringType.code = this.updateCode;

        if (null !== this.hiringType) {
          this.subscriptions.add(this.hiringTypeService.set(this.hiringType).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.hiringType = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedHiringTypes = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.hiringType = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedHiringTypes = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedHiringTypes.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected hiringType?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.hiringTypeService.deleteListByIds(ids).subscribe(
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
