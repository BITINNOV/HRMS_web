import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Position} from '../../../../shared/models/configuration/employee/position';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {Organization} from '../../../../shared/models/configuration/organization';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthenticationService} from '../../../../shared/services/api/authentication.service';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {PositionService} from '../../../../shared/services/api/configuration/employee/position.service';
import {ContractType} from '../../../../shared/models/configuration/hiring/contract-type';
import {PositionType} from '../../../../shared/models/configuration/employee/position-type';
import {Service} from '../../../../shared/models/configuration/employee/service';
import {ContractTypeService} from '../../../../shared/services/api/configuration/hiring/contract-type.service';
import {PositionTypeService} from '../../../../shared/services/api/configuration/employee/position-type.service';
import {ServiceService} from '../../../../shared/services/api/configuration/employee/service.service';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css']
})
export class PositionComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedPositions: Array<Position> = [];
  loading: boolean;
  positionList: Array<Position> = [];
  className: string;
  cols: any[];
  editMode: number;
  positionExportList: Array<Position> = [];
  listTitle = 'Liste des Positions';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];

  // Drop Down
  contractTypeList: Array<ContractType> = [];
  positionTypeList: Array<PositionType> = [];
  serviceList: Array<Service> = [];

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Component Attributes
  currentOrganization: Organization;
  position: Position;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: String;
  addContractType: ContractType;
  addPositionType: PositionType;
  addService: Service;
  // Component Attributes // Update
  updateCode: String;
  updateContractType: ContractType;
  updatePositionType: PositionType;
  updateService: Service;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: String;
  searchContractType: ContractType;
  searchPositionType: PositionType;
  searchService: Service;

  constructor(private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private authenticationService: AuthenticationService,
              private contractTypeService: ContractTypeService,
              private positionTypeService: PositionTypeService,
              private serviceService: ServiceService,
              private globalService: GlobalService,
              private positionService: PositionService,
              private confirmationService: ConfirmationService,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' Position'},
      {label: 'Lister', routerLink: '/core/position'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = Position.name;
    this.cols = [
      {field: 'code', header: 'Code', type: 'string'},
      {field: 'contractType', child: 'code', header: 'Contract Type', type: 'object'},
      {field: 'positionType', child: 'code', header: 'Position Type', type: 'object'},
      {field: 'service', child: 'code', header: 'Service', type: 'object'},
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
    this.subscriptions.add(this.positionService.size().subscribe(
      data => {
        this.collectionSize = data;
      },
      error => {
        this.toastr.error(error.message);
      }
    ));
    this.subscriptions.add(this.positionService.findAllPagination(this.page, this.size).subscribe(
      data => {
        this.positionList = data;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.toastr.error(error.message);
      },
      () => this.spinner.hide()
    ));

    this.subscriptions.add(this.contractTypeService.findAll().subscribe(
      (data) => {
        this.contractTypeList = data;
      },
      (error) => {
        this.spinner.hide();
        this.toastr.error(error.message);
      },
      () => this.spinner.hide()
    ));
    this.subscriptions.add(this.positionTypeService.findAll().subscribe(
      (data) => {
        this.positionTypeList = data;
      },
      (error) => {
        this.spinner.hide();
        this.toastr.error(error.message);
      },
      () => this.spinner.hide()
    ));
    this.subscriptions.add(this.serviceService.findAll().subscribe(
      (data) => {
        this.serviceList = data;
      },
      (error) => {
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
    this.subscriptions.add(this.positionService.findAll().subscribe(
      data => {
        this.positionExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.positionExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.positionExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.positionService.findAll().subscribe(
      data => {
        this.positionExportList = data;
        this.globalService.generatePdf(event, this.positionExportList, this.className, this.listTitle);
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
    this.searchSentence = '';
    let index = 0;

    // Check the Code
    if (this.searchCode) {
      this.searchSentence += 'code:' + this.searchCode + ',';
      index = index + 1;
    }
    // Check the Contract Type
    if (this.searchContractType) {
      this.searchSentence += 'contractType.code:' + this.searchContractType.code + ',';
      index = index + 1;
    }
    // Check the Position Type
    if (this.searchPositionType) {
      this.searchSentence += 'positionType.code:' + this.searchPositionType.code + ',';
      index = index + 1;
    }
    // Check the Service
    if (this.searchService) {
      this.searchSentence += 'service.code:' + this.searchService.code + ',';
      index = index + 1;
    }

    if (index > 0 && index === 1) {
      this.searchSentence = this.searchSentence.slice(0, -1);
    } else {
      this.searchSentence = '.' + this.searchSentence.slice(0, -1);
    }

    this.subscriptions.add(this.positionService.find(this.searchSentence).subscribe(
      (data) => {
        this.positionList = data;
      },
      (error) => {
        this.toastr.error(error.message);
      }
    ));
  }

  reset() {
    this.searchSentence = null;
    this.searchCode = null;
    this.searchContractType = null;
    this.searchPositionType = null;
    this.searchService = null;

    this.loadData();
  }

  onObjectEdited(event) {
    this.editMode = event.operationMode;
    this.selectedPositions = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedPositions[0].code;
      this.updateContractType = this.selectedPositions[0].contractType;
      this.updatePositionType = this.selectedPositions[0].positionType;
      this.updateService = this.selectedPositions[0].service;
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.position = new Position();
    this.position.code = this.addCode;
    this.position.contractType = this.addContractType;
    this.position.positionType = this.addPositionType;
    this.position.service = this.addService;
    this.position.organization = this.currentOrganization;

    this.subscriptions.add(this.positionService.set(this.position).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.position = null;
        this.addCode = null;
        this.addContractType = null;
        this.addPositionType = null;
        this.addService = null;
        this.editMode = null;
        this.selectedPositions = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.position = null;
        this.addCode = null;
        this.addContractType = null;
        this.addPositionType = null;
        this.addService = null;
        this.editMode = null;
        this.selectedPositions = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.position = null;
    this.subscriptions.add(this.positionService.findById(this.selectedPositions[0].id).subscribe(
      (data) => {
        this.position = data;
        this.position.code = this.updateCode;
        this.position.contractType = this.updateContractType;
        this.position.positionType = this.updatePositionType;
        this.position.service = this.updateService;

        if (null !== this.position) {
          this.subscriptions.add(this.positionService.set(this.position).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.position = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateContractType = null;
              this.updatePositionType = null;
              this.updateService = null;
              this.selectedPositions = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.position = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateContractType = null;
              this.updatePositionType = null;
              this.updateService = null;
              this.selectedPositions = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedPositions.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected position?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.positionService.deleteListByIds(ids).subscribe(
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

  filterContractType(event) {
    // in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    const filtered: any[] = [];
    const query = event.query;

    for (let i = 0; i < this.contractTypeList.length; i++) {
      const contractType = this.contractTypeList[i];
      if (contractType.code.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(contractType);
      }
    }

    this.contractTypeList = filtered;
  }

  filterPositionType(event) {
    // in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    const filtered: any[] = [];
    const query = event.query;

    for (let i = 0; i < this.positionTypeList.length; i++) {
      const positionType = this.positionTypeList[i];
      if (positionType.code.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(positionType);
      }
    }

    this.positionTypeList = filtered;
  }

  filterService(event) {
    // in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    const filtered: any[] = [];
    const query = event.query;

    for (let i = 0; i < this.serviceList.length; i++) {
      const service = this.serviceList[i];
      if (service.code.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(service);
      }
    }

    this.serviceList = filtered;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
