import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Service} from '../../../../shared/models/configuration/employee/service';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {Department} from '../../../../shared/models/configuration/employee/department';
import {Organization} from '../../../../shared/models/configuration/organization';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthenticationService} from '../../../../shared/services/api/authentication.service';
import {DepartmentService} from '../../../../shared/services/api/configuration/employee/department.service';
import {GlobalService} from '../../../../shared/services/api/global.service';
import {ServiceService} from '../../../../shared/services/api/configuration/employee/service.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedServices: Array<Service> = [];
  loading: boolean;
  serviceList: Array<Service> = [];
  className: string;
  cols: any[];
  editMode: number;
  serviceExportList: Array<Service> = [];
  listTitle = 'Liste des position types';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Drop Down
  departmentList: Array<Department> = [];

  // Component Attributes
  currentOrganization: Organization;
  service: Service;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  addDepartment: Department;
  // Component Attributes // Update
  updateCode: string;
  updateDepartment: Department;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;
  searchDepartment: Department;

  constructor(private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private authenticationService: AuthenticationService,
              private departmentService: DepartmentService,
              private globalService: GlobalService,
              private serviceService: ServiceService,
              private confirmationService: ConfirmationService,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' Service'},
      {label: 'Lister', routerLink: '/core/service'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = Service.name;
    this.cols = [
      {field: 'code', header: 'Code', type: 'string'},
      {field: 'department', child: 'code', header: 'Department', type: 'object'},
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
    this.subscriptions.add(this.serviceService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      },
      error => {
        this.toastr.error(error.message);
      }
    ));
    this.subscriptions.add(this.serviceService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.serviceList = data;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.toastr.error(error.message);
      },
      () => this.spinner.hide()
    ));
    this.subscriptions.add(this.departmentService.findAll().subscribe(
      (data) => {
        this.departmentList = data;
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
    this.subscriptions.add(this.serviceService.findAll().subscribe(
      data => {
        this.serviceExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.serviceExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.serviceExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.serviceService.findAll().subscribe(
      data => {
        this.serviceExportList = data;
        this.globalService.generatePdf(event, this.serviceExportList, this.className, this.listTitle);
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
    if (this.searchDepartment) {
      this.searchSentence += 'department.id:' + this.searchDepartment.id + ',';
    }
    this.searchSentence += 'organization.id:' + this.currentOrganization.id;

    this.subscriptions.add(this.serviceService.find(this.searchSentence).subscribe(
      (data) => {
        this.serviceList = data;
      },
      (error) => {
        this.toastr.error(error.message);
      }
    ));
  }

  reset() {
    this.searchSentence = null;
    this.searchCode = null;
    this.searchDepartment = null;

    this.loadData();
  }

  onObjectEdited(event) {
    this.editMode = event.operationMode;
    this.selectedServices = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedServices[0].code.toString();
      this.searchDepartment = this.selectedServices[0].department;
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.service = new Service();
    this.service.code = this.addCode;
    this.service.department = this.addDepartment;
    this.service.organization = this.currentOrganization;
    this.subscriptions.add(this.serviceService.set(this.service).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.service = null;
        this.addCode = null;
        this.addDepartment = null;
        this.editMode = null;
        this.selectedServices = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.service = null;
        this.addCode = null;
        this.addDepartment = null;
        this.editMode = null;
        this.selectedServices = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.service = null;
    this.subscriptions.add(this.serviceService.find('code:' + this.selectedServices[0].code).subscribe(
      (data) => {
        this.service = data.length !== 1 ? null : data[0];
        this.service.code = this.updateCode;
        this.service.department = this.updateDepartment;

        if (null !== this.service) {
          this.subscriptions.add(this.serviceService.set(this.service).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.service = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateDepartment = null;
              this.selectedServices = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.service = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateDepartment = null;
              this.selectedServices = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedServices.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected service?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.serviceService.deleteListByIds(ids).subscribe(
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

  filterDepartment(event) {
    // in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    const filtered: any[] = [];
    const query = event.query;

    for (let i = 0; i < this.departmentList.length; i++) {
      const department = this.departmentList[i];
      if (department.code.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(department);
      }
    }

    this.departmentList = filtered;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
