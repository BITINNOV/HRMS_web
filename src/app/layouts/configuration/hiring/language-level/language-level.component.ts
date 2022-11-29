import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {LanguageLevel} from '../../../../shared/models/configuration/hiring/language-level';
import {LanguageLevelService} from '../../../../shared/services/api/configuration/hiring/language-level.service';
import {AuthenticationService} from '../../../../shared/services/api/authentication.service';
import {Organization} from '../../../../shared/models/configuration/organization';


@Component({
  selector: 'app-language-level',
  templateUrl: './language-level.component.html',
  styleUrls: ['./language-level.component.css']
})
export class LanguageLevelComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedLanguageLevels: Array<LanguageLevel> = [];
  loading: boolean;
  languageLevelList: Array<LanguageLevel> = [];
  className: string;
  cols: any[];
  editMode: number;
  languageLevelExportList: Array<LanguageLevel> = [];
  listTitle = 'Liste des language levell';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];


  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  languageLevel: LanguageLevel;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  // Component Attributes // Update
  updateCode: string;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;

  constructor(private languageLevelService: LanguageLevelService,
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
      {label: ' LanguageLevel'},
      {label: 'Lister', routerLink: '/core/languageLevel'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = LanguageLevel.name;
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

    this.subscriptions.add(this.languageLevelService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      }
    ));
    this.subscriptions.add(this.languageLevelService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.languageLevelList = data;
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
    this.subscriptions.add(this.languageLevelService.findAll().subscribe(
      data => {
        this.languageLevelExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.languageLevelExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.languageLevelExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.languageLevelService.findAll().subscribe(
      data => {
        this.languageLevelExportList = data;
        this.globalService.generatePdf(event, this.languageLevelExportList, this.className, this.listTitle);
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

    this.subscriptions.add(this.languageLevelService.find(this.searchSentence).subscribe(
      (data) => {
        this.languageLevelList = data;
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
    this.selectedLanguageLevels = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedLanguageLevels[0].code.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.languageLevel = new LanguageLevel();
    this.languageLevel.code = this.addCode;

    this.subscriptions.add(this.languageLevelService.set(this.languageLevel).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.languageLevel = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedLanguageLevels = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.languageLevel = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedLanguageLevels = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.languageLevel = null;
    this.subscriptions.add(this.languageLevelService.find('code:' + this.selectedLanguageLevels[0].code).subscribe(
      (data) => {
        this.languageLevel = data.length !== 1 ? null : data[0];
        this.languageLevel.code = this.updateCode;

        if (null !== this.languageLevel) {
          this.subscriptions.add(this.languageLevelService.set(this.languageLevel).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.languageLevel = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedLanguageLevels = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.languageLevel = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedLanguageLevels = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedLanguageLevels.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected languageLevel?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.languageLevelService.deleteListByIds(ids).subscribe(
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
