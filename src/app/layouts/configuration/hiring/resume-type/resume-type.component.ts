import {Component, Inject, LOCALE_ID, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {ResumeType} from '../../../../shared/models/configuration/hiring/resume-type';
import {ResumeTypeService} from '../../../../shared/services/api/configuration/hiring/resume-type.service';


@Component({
  selector: 'app-resume-type',
  templateUrl: './resume-type.component.html',
  styleUrls: ['./resume-type.component.css']
})
export class ResumeTypeComponent implements OnInit {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedResumeTypes: Array<ResumeType> = [];
  loading: boolean;
  resumeTypeList: Array<ResumeType> = [];
  className: string;
  cols: any[];
  editMode: number;
  resumeTypeExportList: Array<ResumeType> = [];
  listTitle = 'Liste des resumeTypes';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];


  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  resumeType: ResumeType;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  // Component Attributes // Update
  updateCode: string;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;

  constructor(private resumeTypeService: ResumeTypeService,
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
      {label: ' ResumeType'},
      {label: 'Lister', routerLink: '/core/resumeType'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = ResumeType.name;
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
    this.subscriptions.add(this.resumeTypeService.size().subscribe(
      data => {
        this.collectionSize = data;
      }
    ));
    this.subscriptions.add(this.resumeTypeService.findAllPagination(this.page, this.size).subscribe(
      data => {
        this.resumeTypeList = data;
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
    this.subscriptions.add(this.resumeTypeService.findAll().subscribe(
      data => {
        this.resumeTypeExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.resumeTypeExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.resumeTypeExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.resumeTypeService.findAll().subscribe(
      data => {
        this.resumeTypeExportList = data;
        this.globalService.generatePdf(event, this.resumeTypeExportList, this.className, this.listTitle);
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

    this.subscriptions.add(this.resumeTypeService.find(this.searchSentence).subscribe(
      (data) => {
        this.resumeTypeList = data;
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
    this.selectedResumeTypes = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedResumeTypes[0].code.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.resumeType = new ResumeType();
    this.resumeType.code = this.addCode;

    this.subscriptions.add(this.resumeTypeService.set(this.resumeType).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.resumeType = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedResumeTypes = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.resumeType = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedResumeTypes = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.resumeType = null;
    this.subscriptions.add(this.resumeTypeService.find('code:' + this.selectedResumeTypes[0].code).subscribe(
      (data) => {
        this.resumeType = data.length !== 1 ? null : data[0];
        this.resumeType.code = this.updateCode;

        if (null !== this.resumeType) {
          this.subscriptions.add(this.resumeTypeService.set(this.resumeType).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.resumeType = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedResumeTypes = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.resumeType = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedResumeTypes = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedResumeTypes.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected resumeType?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.resumeTypeService.deleteListByIds(ids).subscribe(
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
