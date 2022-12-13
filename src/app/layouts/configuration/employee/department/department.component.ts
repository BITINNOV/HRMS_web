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
import {Department} from '../../../../shared/models/configuration/employee/department';
import {DepartmentService} from '../../../../shared/services/api/configuration/employee/department.service';
import {Directorate} from '../../../../shared/models/configuration/employee/directorate';
import {DirectorateService} from '../../../../shared/services/api/configuration/employee/directorate.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('fr');
  now = Date.now();
  page = 0;
  size = 5;
  collectionSize: number;
  code: string;
  selectedDepartments: Array<Department> = [];
  loading: boolean;
  departmentList: Array<Department> = [];
  className: string;
  cols: any[];
  editMode: number;
  departmentExportList: Array<Department> = [];
  listTitle = 'Liste des position types';
  subscriptions = new Subscription();
  items: MenuItem[];
  home: MenuItem;
  selectedColumns: Array<any> = [];

  // Dialog
  dialogDisplayAdd = false;
  dialogDisplayEdit = false;

  // Drop Down
  directorateList: Array<Directorate> = [];

  // Component Attributes
  currentOrganization: Organization;
  department: Department;
  ids: Array<number>;
  // Component Attributes // Add
  addCode: string;
  addDirectorate: Directorate;
  // Component Attributes // Update
  updateCode: string;
  updateDirectorate: Directorate;
  // Component Attributes // Search
  searchSentence: string;
  searchCode: string;
  searchDirectorate: Directorate;

  constructor(private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private authenticationService: AuthenticationService,
              private directorateService: DirectorateService,
              private globalService: GlobalService,
              private departmentService: DepartmentService,
              private confirmationService: ConfirmationService,
              @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.items = [
      {label: ' Department'},
      {label: 'Lister', routerLink: '/core/department'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.className = Department.name;
    this.cols = [
      {field: 'code', header: 'Code', type: 'string'},
      {field: 'directorate', child: 'code', header: 'Directorate', type: 'object'},
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
    this.subscriptions.add(this.departmentService.sizeSearch(this.searchSentence).subscribe(
      data => {
        this.collectionSize = data;
      },
      error => {
        this.toastr.error(error.message);
      }
    ));
    this.subscriptions.add(this.departmentService.findPagination(this.page, this.size, this.searchSentence).subscribe(
      data => {
        this.departmentList = data;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.toastr.error(error.message);
      },
      () => this.spinner.hide()
    ));
    this.subscriptions.add(this.directorateService.findAll().subscribe(
      (data) => {
        this.directorateList = data;
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
    this.subscriptions.add(this.departmentService.findAll().subscribe(
      data => {
        this.departmentExportList = data;
        if (event != null) {
          this.globalService.generateExcel(event, this.departmentExportList, this.className, this.listTitle);
        } else {
          this.globalService.generateExcel(this.cols, this.departmentExportList, this.className, this.listTitle);
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
    this.subscriptions.add(this.departmentService.findAll().subscribe(
      data => {
        this.departmentExportList = data;
        this.globalService.generatePdf(event, this.departmentExportList, this.className, this.listTitle);
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
    if (this.searchDirectorate) {
      this.searchSentence += 'directorate.id:' + this.searchDirectorate.id + ',';
    }
    this.searchSentence += 'organization.id:' + this.currentOrganization.id;

    this.subscriptions.add(this.departmentService.find(this.searchSentence).subscribe(
      (data) => {
        this.departmentList = data;
      },
      (error) => {
        this.toastr.error(error.message);
      }
    ));
  }

  reset() {
    this.searchSentence = null;
    this.searchCode = null;
    this.searchDirectorate = null;

    this.loadData();
  }

  onObjectEdited(event) {
    this.editMode = event.operationMode;
    this.selectedDepartments = event.object;

    if (this.editMode === 1) { // ADD
      this.dialogDisplayAdd = true;
    } else if (this.editMode === 2) { // UPDATE
      this.updateCode = this.selectedDepartments[0].code.toString();
      this.updateDirectorate = this.selectedDepartments[0].directorate;
      this.dialogDisplayEdit = true;
    } else if (this.editMode === 3) { // DELETE
      this.onDelete();
    }
  }

  onSave() {
    this.department = new Department();
    this.department.code = this.addCode;
    this.department.directorate = this.addDirectorate;
    this.department.organization = this.currentOrganization;
    this.subscriptions.add(this.departmentService.set(this.department).subscribe(
      (data) => {
        this.toastr.success('Elément est Enregistré Avec Succès', 'Création');
        this.department = null;
        this.addCode = null;
        this.addDirectorate = null;
        this.editMode = null;
        this.selectedDepartments = null;
        this.loadData();
      },
      (error) => {
        this.toastr.error(error.message);
        this.department = null;
        this.addCode = null;
        this.addDirectorate = null;
        this.editMode = null;
        this.selectedDepartments = null;
        this.loadData();
      }
    ));

  }

  onEdit() {
    this.department = null;
    this.subscriptions.add(this.departmentService.find('code:' + this.selectedDepartments[0].code).subscribe(
      (data) => {
        this.department = data.length !== 1 ? null : data[0];
        this.department.code = this.updateCode;
        this.department.directorate = this.updateDirectorate;

        if (null !== this.department) {
          this.subscriptions.add(this.departmentService.set(this.department).subscribe(
            (data1) => {
              this.toastr.success('Elément est Enregistré Avec Succès', 'Edition');
              this.department = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateDirectorate = null;
              this.selectedDepartments = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            },
            (error) => {
              this.toastr.error(error.message);
              this.department = null;
              this.editMode = null;
              this.updateCode = null;
              this.updateDirectorate = null;
              this.selectedDepartments = null;
              this.dialogDisplayEdit = false;
              this.loadData();
            }
          ));
        }
      }
    ));
  }

  onDelete() {
    const ids = this.selectedDepartments.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected department?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.departmentService.deleteListByIds(ids).subscribe(
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

  filterDirectorate(event) {
    const filtered: any[] = [];
    const code = event.query;

    if (code) {
      for (let i = 0; i < this.directorateList.length; i++) {
        const directorate = this.directorateList[i];
        if (directorate.code.toLowerCase().indexOf(code.toLowerCase()) === 0) {
          filtered.push(directorate);
        }
      }
      this.directorateList = filtered;
    } else {
      this.subscriptions.add(this.directorateService.findAll().subscribe(
        (data) => {
          this.directorateList = data;
        },
        (error) => {
          this.toastr.error(error.message);
        },
      ));
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
