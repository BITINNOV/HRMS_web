import {Component, Inject, LOCALE_ID, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {DisabilityNatureService} from '../../../../shared/services/api/configuration/hiring/disability-nature.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {DisabilityNature} from '../../../../shared/models/configuration/hiring/disability-nature';
import {Organization} from '../../../../shared/models/configuration/organization';
import {AuthenticationService} from '../../../../shared/services/api/authentication.service';


@Component({
  selector: 'app-disability-nature',
  templateUrl: './disability-nature.component.html',
  styleUrls: ['./disability-nature.component.css']
})
export class DisabilityNatureComponent implements OnInit {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedDisabilityNatures: Array<DisabilityNature> = [];
  loading: boolean;
  disabilityNatureList: Array<DisabilityNature> = [];
  className: string;
  cols: any[];
  editMode: number;
  disabilityNatureExportList: Array<DisabilityNature> = [];
  listTitle = 'Liste des disability natures';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];


  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  disabilityNature: DisabilityNature;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  // Component Attributes // Update
  updateCode: string;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;

  constructor(private disabilityNatureService: DisabilityNatureService,
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
      {label: ' DisabilityNature'},
      {label: 'Lister', routerLink: '/core/disabilityNature'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = DisabilityNature.name;
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
    this.currentOrganization = this.authenticationService.getCurrentOrganization();
    this.searchSentence = 'organization.code:' + this.currentOrganization.code;
    this.subscriptions.add(this.disabilityNatureService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      }
    ));
    this.subscriptions.add(this.disabilityNatureService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.disabilityNatureList = data;
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
    this.subscriptions.add(this.disabilityNatureService.findAll().subscribe(
      data => {
        this.disabilityNatureExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.disabilityNatureExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.disabilityNatureExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.disabilityNatureService.findAll().subscribe(
      data => {
        this.disabilityNatureExportList = data;
        this.globalService.generatePdf(event, this.disabilityNatureExportList, this.className, this.listTitle);
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

    this.subscriptions.add(this.disabilityNatureService.find(this.searchSentence).subscribe(
      (data) => {
        this.disabilityNatureList = data;
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
    this.selectedDisabilityNatures = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedDisabilityNatures[0].code.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.disabilityNature = new DisabilityNature();
    this.disabilityNature.code = this.addCode;

    this.subscriptions.add(this.disabilityNatureService.set(this.disabilityNature).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.disabilityNature = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedDisabilityNatures = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.disabilityNature = null;
        this.addCode = null;
        this.editMode = null;
        this.selectedDisabilityNatures = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.disabilityNature = null;
    this.subscriptions.add(this.disabilityNatureService.find('code:' + this.selectedDisabilityNatures[0].code).subscribe(
      (data) => {
        this.disabilityNature = data.length !== 1 ? null : data[0];
        this.disabilityNature.code = this.updateCode;

        if (null !== this.disabilityNature) {
          this.subscriptions.add(this.disabilityNatureService.set(this.disabilityNature).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.disabilityNature = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedDisabilityNatures = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.disabilityNature = null;
              this.editMode = null;
              this.updateCode = null;
              this.selectedDisabilityNatures = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedDisabilityNatures.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected disabilityNature?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.disabilityNatureService.deleteListByIds(ids).subscribe(
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
