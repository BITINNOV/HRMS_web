import {ToastrService} from 'ngx-toastr';
import {GlobalService} from '../../../shared/services/api/global.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {Subscription} from 'rxjs';
import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {Organization} from '../../../shared/models/configuration/organization';
import {OrganizationService} from '../../../shared/services/api/configuration/organization.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})

export class OrganizationComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedOrganizations: Array<Organization> = [];
  loading: boolean;
  organizationList: Array<Organization> = [];
  className: string;
  cols: any[];
  editMode: number;
  organizationExportList: Array<Organization> = [];
  listTitle = 'Liste des organizations';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  organization: Organization;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  addDescription: string;
  addAdress: string;
  addPhoneNumber: string;
  addFaxNumber: string;
  addResponsabiliteCivile: string;
  addIdentifiantFiscal: string;
  addIdentifiantCommunEntreprise: string;
  // Component Attributes // Updtae
  updateCode: string;
  updateDescription: string;
  updateAdress: string;
  updatePhoneNumber: string;
  updateFaxNumber: string;
  updateResponsabiliteCivile: string;
  updateIdentifiantFiscal: string;
  updateIdentifiantCommunEntreprise: string;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;
  searchDescription: string;
  searchAdress: string;
  searchPhoneNumber: string;
  searchFaxNumber: string;
  searchResponsabiliteCivile: string;
  searchIdentifiantFiscal: string;
  searchIdentifiantCommunEntreprise: string;

  constructor(private organizationService: OrganizationService,
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
      {label: ' Organization'},
      {label: 'Lister', routerLink: '/core/organization'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = Organization.name;
    this.cols = [
      {field: 'code', header: 'Code', type: 'string'},
      {field: 'description', header: 'Description', type: 'string'},
      {field: 'adress', header: 'Adress', type: 'string'},
      {field: 'phoneNumber', header: 'Phone Number', type: 'string'},
      {field: 'faxNumber', header: 'Fax Number', type: 'string'},
      {field: 'responsabiliteCivile', header: 'Responsabilite Civile', type: 'string'},
      {field: 'identifiantFiscal', header: 'Identifiant Fiscal', type: 'string'},
      {field: 'identifiantCommunEntreprise', header: 'ICE', type: 'string'},
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
    this.subscriptions.add(this.organizationService.size().subscribe(
      data => {
        this.collectionSize = data;
      }
    ));
    this.subscriptions.add(this.organizationService.findAllPagination(this.page, this.size).subscribe(
      data => {
        this.organizationList = data;
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
    this.subscriptions.add(this.organizationService.findAll().subscribe(
      data => {
        this.organizationExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.organizationExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.organizationExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.organizationService.findAll().subscribe(
      data => {
        this.organizationExportList = data;
        this.globalService.generatePdf(event, this.organizationExportList, this.className, this.listTitle);
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
    this.searchSentence = '';
    let index = 0;

    // Check the Code
    if (this.searchCode) {
      this.searchSentence += 'code:' + this.searchCode + ',';
      index = index + 1;
    }
    // Check the Description
    if (this.searchDescription) {
      this.searchSentence += 'description:' + this.searchDescription + ',';
      index = index + 1;
    }
    // Check the Adress
    if (this.searchAdress) {
      this.searchSentence += 'adress:' + this.searchAdress + ',';
      index = index + 1;
    }
    // Check the Phone Number
    if (this.searchPhoneNumber) {
      this.searchSentence += 'phoneNumber:' + this.searchPhoneNumber + ',';
      index = index + 1;
    }
    // Check the Fax Number
    if (this.searchFaxNumber) {
      this.searchSentence += 'faxNumber:' + this.searchFaxNumber + ',';
      index = index + 1;
    }
    // Check the Responsabilite Civile
    if (this.searchResponsabiliteCivile) {
      this.searchSentence += 'responsabiliteCivile:' + this.searchResponsabiliteCivile + ',';
      index = index + 1;
    }
    // Check the Identifiant Fiscal
    if (this.searchIdentifiantFiscal) {
      this.searchSentence += 'identifiantFiscal:' + this.searchIdentifiantFiscal + ',';
      index = index + 1;
    }
    // Check the ICE
    if (this.searchIdentifiantCommunEntreprise) {
      this.searchSentence += 'identifiantCommunEntreprise:' + this.searchIdentifiantCommunEntreprise + ',';
      index = index + 1;
    }

    if (index > 0 && index === 1) {
      this.searchSentence = this.searchSentence.slice(0, -1);
    } else {
      this.searchSentence = '.' + this.searchSentence.slice(0, -1);
    }

    this.organizationService.find(this.searchSentence).subscribe(
      (data) => {
        this.organizationList = data;
      },
      (error) => {
        this.toastr.error(error.message);
      }
    );
  }

  reset() {
    this.searchCode = null;
    this.searchDescription = null;
    this.searchAdress = null;
    this.searchPhoneNumber = null;
    this.searchFaxNumber = null;
    this.searchResponsabiliteCivile = null;
    this.searchIdentifiantFiscal = null;
    this.searchIdentifiantCommunEntreprise = null;

    this.loadData();
  }

  onObjectEdited(event) {
    this.editMode = event.operationMode;
    this.selectedOrganizations = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedOrganizations[0].code.toString();
      this.updateAdress = this.selectedOrganizations[0].adress.toString();
      this.updateFaxNumber = this.selectedOrganizations[0].faxNumber.toString();
      this.updateDescription = this.selectedOrganizations[0].description.toString();
      this.updatePhoneNumber = this.selectedOrganizations[0].phoneNumber.toString();
      this.updateIdentifiantFiscal = this.selectedOrganizations[0].identifiantFiscal.toString();
      this.updateResponsabiliteCivile = this.selectedOrganizations[0].responsabiliteCivile.toString();
      this.updateIdentifiantCommunEntreprise = this.selectedOrganizations[0].identifiantCommunEntreprise.toString();
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.organization = new Organization();
    this.organization.code = this.addCode;
    this.organization.adress = this.addAdress;
    this.organization.faxNumber = this.addFaxNumber;
    this.organization.description = this.addDescription;
    this.organization.phoneNumber = this.addPhoneNumber;
    this.organization.identifiantFiscal = this.addIdentifiantFiscal;
    this.organization.responsabiliteCivile = this.addResponsabiliteCivile;
    this.organization.identifiantCommunEntreprise = this.addIdentifiantCommunEntreprise;

    this.subscriptions.add(this.organizationService.set(this.organization).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.organization = null;
        this.addCode = null;
        this.addAdress = null;
        this.addFaxNumber = null;
        this.addDescription = null;
        this.addPhoneNumber = null;
        this.addIdentifiantFiscal = null;
        this.addResponsabiliteCivile = null;
        this.addIdentifiantCommunEntreprise = null;
        this.editMode = null;
        this.selectedOrganizations = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.organization = null;
        this.addCode = null;
        this.addAdress = null;
        this.addFaxNumber = null;
        this.addDescription = null;
        this.addPhoneNumber = null;
        this.addIdentifiantFiscal = null;
        this.addResponsabiliteCivile = null;
        this.addIdentifiantCommunEntreprise = null;
        this.editMode = null;
        this.selectedOrganizations = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.organization = null;
    this.subscriptions.add(this.organizationService.find('code:' + this.selectedOrganizations[0].code).subscribe(
      (data) => {
        this.organization = data.length !== 1 ? null : data[0];
        this.organization.code = this.updateCode;
        this.organization.adress = this.updateAdress;
        this.organization.faxNumber = this.updateFaxNumber;
        this.organization.description = this.updateDescription;
        this.organization.phoneNumber = this.updatePhoneNumber;
        this.organization.identifiantFiscal = this.updateIdentifiantFiscal;
        this.organization.responsabiliteCivile = this.updateResponsabiliteCivile;
        this.organization.identifiantCommunEntreprise = this.updateIdentifiantCommunEntreprise;

        if (null !== this.organization) {
          this.subscriptions.add(this.organizationService.set(this.organization).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.organization = null;
              this.updateCode = null;
              this.updateAdress = null;
              this.updateFaxNumber = null;
              this.updateDescription = null;
              this.updatePhoneNumber = null;
              this.updateIdentifiantFiscal = null;
              this.updateResponsabiliteCivile = null;
              this.updateIdentifiantCommunEntreprise = null;
              this.editMode = null;
              this.selectedOrganizations = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.organization = null;
              this.updateCode = null;
              this.updateAdress = null;
              this.updateFaxNumber = null;
              this.updateDescription = null;
              this.updatePhoneNumber = null;
              this.updateIdentifiantFiscal = null;
              this.updateResponsabiliteCivile = null;
              this.updateIdentifiantCommunEntreprise = null;
              this.editMode = null;
              this.selectedOrganizations = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedOrganizations.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected organization?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.organizationService.deleteListByIds(ids).subscribe(
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
