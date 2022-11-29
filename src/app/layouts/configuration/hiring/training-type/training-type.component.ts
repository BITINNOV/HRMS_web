import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {TrainingType} from '../../../../shared/models/configuration/hiring/training-type';
import {TrainingTypeService} from '../../../../shared/services/api/configuration/hiring/training-type.service';
import {AuthenticationService} from '../../../../shared/services/api/authentication.service';
import {Organization} from '../../../../shared/models/configuration/organization';


@Component({
  selector: 'app-training-type',
  templateUrl: './training-type.component.html',
  styleUrls: ['./training-type.component.css']
})
export class TrainingTypeComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedTrainingTypes: Array<TrainingType> = [];
  loading: boolean;
  trainingTypeList: Array<TrainingType> = [];
  className: string;
  cols: any[];
  editMode: number;
  trainingTypeExportList: Array<TrainingType> = [];
  listTitle = 'Liste des trainingTypes';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];


  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  trainingType: TrainingType;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  // Component Attributes // Update
  updateCode: string;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;

  constructor(private trainingTypeService: TrainingTypeService,
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
      {label: ' TrainingType'},
      {label: 'Lister', routerLink: '/core/trainingType'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = TrainingType.name;
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

    this.subscriptions.add(this.trainingTypeService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      }
    ));
    this.subscriptions.add(this.trainingTypeService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.trainingTypeList = data;
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
    this.subscriptions.add(this.trainingTypeService.findAll().subscribe(
      data => {
        this.trainingTypeExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.trainingTypeExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.trainingTypeExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.trainingTypeService.findAll().subscribe(
      data => {
        this.trainingTypeExportList = data;
        this.globalService.generatePdf(event, this.trainingTypeExportList, this.className, this.listTitle);
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

    this.subscriptions.add(this.trainingTypeService.find(this.searchSentence).subscribe(
      (data) => {
        this.trainingTypeList = data;
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
    this.selectedTrainingTypes = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedTrainingTypes[0].code.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.trainingType = new TrainingType();
    this.trainingType.code = this.addCode;

    this.subscriptions.add(this.trainingTypeService.set(this.trainingType).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.trainingType = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedTrainingTypes = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.trainingType = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedTrainingTypes = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.trainingType = null;
    this.subscriptions.add(this.trainingTypeService.find('code:' + this.selectedTrainingTypes[0].code).subscribe(
      (data) => {
        this.trainingType = data.length !== 1 ? null : data[0];
        this.trainingType.code = this.updateCode;

        if (null !== this.trainingType) {
          this.subscriptions.add(this.trainingTypeService.set(this.trainingType).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.trainingType = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedTrainingTypes = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.trainingType = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedTrainingTypes = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedTrainingTypes.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected trainingType?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.trainingTypeService.deleteListByIds(ids).subscribe(
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
