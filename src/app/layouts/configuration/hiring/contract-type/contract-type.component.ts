import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {Organization} from '../../../../shared/models/configuration/organization';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthenticationService} from '../../../../shared/services/api/authentication.service';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {ContractType} from '../../../../shared/models/configuration/hiring/contract-type';
import {ContractTypeService} from '../../../../shared/services/api/configuration/hiring/contract-type.service';

@Component({
  selector: 'app-contract-type',
  templateUrl: './contract-type.component.html',
  styleUrls: ['./contract-type.component.css']
})
export class ContractTypeComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedContractTypes: Array<ContractType> = [];
  loading: boolean;
  contractTypeList: Array<ContractType> = [];
  className: string;
  cols: any[];
  editMode: number;
  contractTypeExportList: Array<ContractType> = [];
  listTitle = 'Liste des contract types';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  contractType: ContractType;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  addValidate: boolean;
  // Component Attributes // Update
  updateCode: string;
  updateValidate: boolean;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;
  searchValidate: boolean;

  constructor(private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private authenticationService: AuthenticationService,
              private globalService: GlobalService,
              private contractTypeService: ContractTypeService,
              private confirmationService: ConfirmationService,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' ContractType'},
      {label: 'Lister', routerLink: '/core/contractType'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = ContractType.name;
    this.cols = [
      {field: 'code', header: 'Code', type: 'string'},
      {field: 'validate', header: 'Validate', type: 'boolean'},
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
    this.searchSentence = '';
    this.currentOrganization = this.authenticationService.getCurrentOrganization();
    this.searchSentence = 'organization.code:' + this.currentOrganization.code;
    this.subscriptions.add(this.contractTypeService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      },
      error => {
        this.toastr.error(error.message);
      }
    ));
    this.subscriptions.add(this.contractTypeService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.contractTypeList = data;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.toastr.error(error.message);
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
    this.subscriptions.add(this.contractTypeService.findAll().subscribe(
      data => {
        this.contractTypeExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.contractTypeExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.contractTypeExportList, this.className, this.listTitle);
        }
        this.spinner.hide();
      },
      error => {
        this.toastr.error(error.message);
        this.spinner.hide();
      },
      () => this.spinner.hide()
    ));
  }

  onExportPdf(event) {
    this.subscriptions.add(this.contractTypeService.findAll().subscribe(
      data => {
        this.contractTypeExportList = data;
        this.globalService.generatePdf(event, this.contractTypeExportList, this.className, this.listTitle);
        this.spinner.hide();
      },
      error => {
        this.toastr.error(error.message);
        this.spinner.hide();
      },
      () => this.spinner.hide()
    ));
  }

  search() {
    this.searchSentence = '.';
    if (this.searchCode) {
      this.searchSentence += 'code:' + this.searchCode + ',';
    }
    if (this.searchValidate) {
      this.searchSentence += 'validate:' + this.searchValidate + ',';
    }
    this.searchSentence += 'organization.code:' + this.currentOrganization.code;

    this.subscriptions.add(this.contractTypeService.find(this.searchSentence).subscribe(
      (data) => {
        this.contractTypeList = data;
      },
      (error) => {
        this.toastr.error(error.message);
      }
    ));
  }

  reset() {
    this.searchSentence = null;
    this.searchCode = null;
    this.searchValidate = null;

    this.loadData();
  }

  onObjectEdited(event) {
    this.editMode = event.operationMode;
    this.selectedContractTypes = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedContractTypes[0].code.toString();
      this.updateValidate = this.selectedContractTypes[0].validate;
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.contractType = new ContractType();
    this.contractType.code = this.addCode;
    this.contractType.validate = this.addValidate;
    this.contractType.organization = this.currentOrganization;
    this.subscriptions.add(this.contractTypeService.set(this.contractType).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.contractType = null;
        this.addCode = null;
        this.addValidate = null;
        this.editMode = null;
        this.selectedContractTypes = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.contractType = null;
        this.addCode = null;
        this.addValidate = null;
        this.editMode = null;
        this.selectedContractTypes = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.contractType = null;
    this.subscriptions.add(this.contractTypeService.find('code:' + this.selectedContractTypes[0].code).subscribe(
      (data) => {
        this.contractType = data.length !== 1 ? null : data[0];
        this.contractType.code = this.updateCode;
        this.contractType.validate = this.updateValidate;

        if (null !== this.contractType) {
          this.subscriptions.add(this.contractTypeService.set(this.contractType).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.contractType = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateValidate = null;
              this.selectedContractTypes = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.contractType = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateValidate = null;
              this.selectedContractTypes = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedContractTypes.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected contractType?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.contractTypeService.deleteListByIds(ids).subscribe(
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
