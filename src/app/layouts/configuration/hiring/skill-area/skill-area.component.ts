import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {SkillArea} from '../../../../shared/models/configuration/hiring/skill-area';
import {SkillAreaService} from '../../../../shared/services/api/configuration/hiring/skill-area.service';
import {AuthenticationService} from '../../../../shared/services/api/authentication.service';
import {Organization} from '../../../../shared/models/configuration/organization';


@Component({
  selector: 'app-skill-area',
  templateUrl: './skill-area.component.html',
  styleUrls: ['./skill-area.component.css']
})
export class SkillAreaComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedSkillAreas: Array<SkillArea> = [];
  loading: boolean;
  skillAreaList: Array<SkillArea> = [];
  className: string;
  cols: any[];
  editMode: number;
  skillAreaExportList: Array<SkillArea> = [];
  listTitle = 'Liste des skillAreas';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];


  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  skillArea: SkillArea;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  // Component Attributes // Update
  updateCode: string;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;

  constructor(private skillAreaService: SkillAreaService,
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
      {label: ' SkillArea'},
      {label: 'Lister', routerLink: '/core/skillArea'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = SkillArea.name;
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

    this.subscriptions.add(this.skillAreaService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      }
    ));
    this.subscriptions.add(this.skillAreaService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.skillAreaList = data;
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
    this.subscriptions.add(this.skillAreaService.findAll().subscribe(
      data => {
        this.skillAreaExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.skillAreaExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.skillAreaExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.skillAreaService.findAll().subscribe(
      data => {
        this.skillAreaExportList = data;
        this.globalService.generatePdf(event, this.skillAreaExportList, this.className, this.listTitle);
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

    this.subscriptions.add(this.skillAreaService.find(this.searchSentence).subscribe(
      (data) => {
        this.skillAreaList = data;
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
    this.selectedSkillAreas = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedSkillAreas[0].code.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.skillArea = new SkillArea();
    this.skillArea.code = this.addCode;

    this.subscriptions.add(this.skillAreaService.set(this.skillArea).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.skillArea = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedSkillAreas = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.skillArea = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedSkillAreas = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.skillArea = null;
    this.subscriptions.add(this.skillAreaService.find('code:' + this.selectedSkillAreas[0].code).subscribe(
      (data) => {
        this.skillArea = data.length !== 1 ? null : data[0];
        this.skillArea.code = this.updateCode;

        if (null !== this.skillArea) {
          this.subscriptions.add(this.skillAreaService.set(this.skillArea).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.skillArea = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedSkillAreas = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.skillArea = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedSkillAreas = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedSkillAreas.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected skillArea?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.skillAreaService.deleteListByIds(ids).subscribe(
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
