import {Component, Inject, LOCALE_ID, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {TrainingLevel} from '../../../../shared/models/configuration/hiring/training-level';
import {TrainingLevelService} from '../../../../shared/services/api/configuration/hiring/training-level.service';


@Component({
  selector: 'app-training-level',
  templateUrl: './training-level.component.html',
  styleUrls: ['./training-level.component.css']
})
export class TrainingLevelComponent implements OnInit {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedTrainingLevels: Array<TrainingLevel> = [];
  loading: boolean;
  trainingLevelList: Array<TrainingLevel> = [];
  className: string;
  cols: any[];
  editMode: number;
  trainingLevelExportList: Array<TrainingLevel> = [];
  listTitle = 'Liste des trainingLevels';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];


  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  trainingLevel: TrainingLevel;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  // Component Attributes // Update
  updateCode: string;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;

  constructor(private trainingLevelService: TrainingLevelService,
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
      {label: ' TrainingLevel'},
      {label: 'Lister', routerLink: '/core/trainingLevel'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = TrainingLevel.name;
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
    this.subscriptions.add(this.trainingLevelService.size().subscribe(
      data => {
        this.collectionSize = data;
      }
    ));
    this.subscriptions.add(this.trainingLevelService.findAllPagination(this.page, this.size).subscribe(
      data => {
        this.trainingLevelList = data;
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
    this.subscriptions.add(this.trainingLevelService.findAll().subscribe(
      data => {
        this.trainingLevelExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.trainingLevelExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.trainingLevelExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.trainingLevelService.findAll().subscribe(
      data => {
        this.trainingLevelExportList = data;
        this.globalService.generatePdf(event, this.trainingLevelExportList, this.className, this.listTitle);
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

    this.subscriptions.add(this.trainingLevelService.find(this.searchSentence).subscribe(
      (data) => {
        this.trainingLevelList = data;
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
    this.selectedTrainingLevels = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedTrainingLevels[0].code.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.trainingLevel = new TrainingLevel();
    this.trainingLevel.code = this.addCode;

    this.subscriptions.add(this.trainingLevelService.set(this.trainingLevel).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.trainingLevel = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedTrainingLevels = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.trainingLevel = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedTrainingLevels = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.trainingLevel = null;
    this.subscriptions.add(this.trainingLevelService.find('code:' + this.selectedTrainingLevels[0].code).subscribe(
      (data) => {
        this.trainingLevel = data.length !== 1 ? null : data[0];
        this.trainingLevel.code = this.updateCode;

        if (null !== this.trainingLevel) {
          this.subscriptions.add(this.trainingLevelService.set(this.trainingLevel).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.trainingLevel = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedTrainingLevels = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.trainingLevel = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedTrainingLevels = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedTrainingLevels.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected trainingLevel?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.trainingLevelService.deleteListByIds(ids).subscribe(
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
